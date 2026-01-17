import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Send, ArrowLeft, MessageCircle } from 'lucide-react';
import { messagesApi } from '@/api/messages';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserLink } from '@/components/common/UserLink';
import { cn } from '@/lib/utils';
import type { Message, Conversation, TypingIndicator } from '@/types';

export default function MessagesPage() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const [isMobileListView, setIsMobileListView] = useState(!conversationId);

  useEffect(() => {
    setIsMobileListView(!conversationId);
  }, [conversationId]);

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Conversation List - Hidden on mobile when viewing a conversation */}
      <div className={cn(
        'w-full md:w-80 lg:w-96 border-r flex-shrink-0',
        !isMobileListView && 'hidden md:block'
      )}>
        <ConversationList 
          activeConversationId={conversationId}
          onSelectConversation={(id) => navigate(`/app/messages/${id}`)}
        />
      </div>

      {/* Chat Area */}
      <div className={cn(
        'flex-1 flex flex-col',
        isMobileListView && 'hidden md:flex'
      )}>
        {conversationId ? (
          <ChatArea 
            conversationId={conversationId}
            onBack={() => navigate('/app/messages')}
          />
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  );
}

function ConversationList({ 
  activeConversationId,
  onSelectConversation,
}: { 
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
}) {
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: messagesApi.getConversations,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!conversations?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <MessageCircle className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <h3 className="font-medium text-foreground mb-1">No messages yet</h3>
        <p className="text-sm text-muted-foreground">
          Start a conversation with a friend
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isActive={conversation.id === activeConversationId}
            onClick={() => onSelectConversation(conversation.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

function ConversationItem({
  conversation,
  isActive,
  onClick,
}: {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  const isUnread = conversation.lastMessage && 
    new Date(conversation.lastMessage.createdAt) > new Date(conversation.lastReadAt);

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left',
        isActive ? 'bg-primary/10' : 'hover:bg-muted',
        isUnread && 'bg-primary/5'
      )}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={conversation.otherUser?.avatarUrl || undefined} />
        <AvatarFallback>
          {conversation.otherUser?.displayName?.charAt(0) || 
           conversation.otherUser?.username?.charAt(0) || '?'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={cn(
            'font-medium truncate',
            isUnread && 'font-semibold'
          )}>
            {conversation.otherUser?.displayName || conversation.otherUser?.username}
          </p>
          {conversation.lastMessage && (
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatMessageTime(conversation.lastMessage.createdAt)}
            </span>
          )}
        </div>
        {conversation.lastMessage && (
          <p className={cn(
            'text-sm truncate',
            isUnread ? 'text-foreground' : 'text-muted-foreground'
          )}>
            {conversation.lastMessage.content}
          </p>
        )}
      </div>

      {isUnread && (
        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
      )}
    </button>
  );
}

function ChatArea({ 
  conversationId,
  onBack,
}: { 
  conversationId: string;
  onBack: () => void;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { 
    joinConversation, 
    leaveConversation, 
    sendMessage: socketSendMessage,
    onNewMessage,
    onTypingUpdate,
    startTyping,
    stopTyping,
    markAsRead,
  } = useSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch initial messages
  const { data: initialData, isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => messagesApi.getMessages(conversationId),
    enabled: !!conversationId,
  });

  // Get conversation details
  const { data: conversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: messagesApi.getConversations,
  });

  const conversation = conversations?.find((c) => c.id === conversationId);

  // Set initial messages
  useEffect(() => {
    if (initialData?.messages) {
      setMessages(initialData.messages);
    }
  }, [initialData]);

  // Join/leave conversation room
  useEffect(() => {
    joinConversation(conversationId);
    markAsRead(conversationId);

    return () => {
      leaveConversation(conversationId);
    };
  }, [conversationId, joinConversation, leaveConversation, markAsRead]);

  // Listen for new messages
  useEffect(() => {
    const cleanup = onNewMessage((message) => {
      if (message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message]);
        markAsRead(conversationId);
      }
    });

    return cleanup;
  }, [conversationId, onNewMessage, markAsRead]);

  // Listen for typing indicators
  useEffect(() => {
    const cleanup = onTypingUpdate((data: TypingIndicator) => {
      if (data.conversationId === conversationId) {
        setTypingUsers((prev) => {
          const next = new Map(prev);
          if (data.isTyping) {
            next.set(data.userId, data.username);
          } else {
            next.delete(data.userId);
          }
          return next;
        });
      }
    });

    return cleanup;
  }, [conversationId, onTypingUpdate]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      startTyping(conversationId);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping(conversationId);
    }, 2000);
  }, [conversationId, isTyping, startTyping, stopTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Optimistic update
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      content: inputValue.trim(),
      conversationId,
      senderId: user!.id,
      sender: {
        id: user!.id,
        username: user!.username,
        displayName: user!.displayName || null,
        avatarUrl: null,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    socketSendMessage(conversationId, inputValue.trim());
    setInputValue('');
    
    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(false);
    stopTyping(conversationId);

    // Invalidate conversations to update last message
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  };

  if (isLoading) {
    return <ChatSkeleton />;
  }

  return (
    <>
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        {conversation?.otherUser && (
          <>
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.otherUser.avatarUrl || undefined} />
              <AvatarFallback>
                {conversation.otherUser.displayName?.charAt(0) || 
                 conversation.otherUser.username?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <UserLink 
                username={conversation.otherUser.username}
                displayName={conversation.otherUser.displayName}
                className="font-semibold"
              />
              {typingUsers.size > 0 && (
                <p className="text-xs text-primary animate-pulse">typing...</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === user?.id}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <Input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </>
  );
}

function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
      <div className={cn(
        'max-w-[75%] rounded-2xl px-4 py-2',
        isOwn 
          ? 'bg-primary text-primary-foreground rounded-br-md' 
          : 'bg-muted rounded-bl-md'
      )}>
        <p className="break-words">{message.content}</p>
        <p className={cn(
          'text-[10px] mt-1',
          isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
        )}>
          {formatMessageTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

function EmptyChat() {
  return (
    <div className="flex-1 flex items-center justify-center text-center p-8">
      <div>
        <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
        <p className="text-muted-foreground">
          Choose a friend to start messaging
        </p>
      </div>
    </div>
  );
}

function ChatSkeleton() {
  return (
    <>
      <div className="flex items-center gap-3 p-4 border-b">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="flex-1 p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={cn('flex', i % 2 === 0 ? 'justify-end' : 'justify-start')}>
            <Skeleton className="h-12 w-48 rounded-2xl" />
          </div>
        ))}
      </div>
    </>
  );
}

function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
