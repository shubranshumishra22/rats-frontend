import { useState } from 'react';
import { Search, UserPlus, Users, Clock } from 'lucide-react';
import { AppShell } from '@/components/layout';
import { PageHeader, FriendList, FriendRequestList, ErrorState } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useFriends, useFriendRequests, useSearchUsers, useSendFriendRequest } from '@/hooks/useFriends';

export function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeTab, setActiveTab] = useState('friends');

  const { data: friends, isLoading: friendsLoading, error: friendsError, refetch: refetchFriends } = useFriends();
  const { data: requests, isLoading: requestsLoading, error: requestsError, refetch: refetchRequests } = useFriendRequests();
  const { data: searchResults, isLoading: searchLoading } = useSearchUsers(debouncedQuery);
  const sendRequest = useSendFriendRequest();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(searchQuery.trim());
  };

  const handleSendRequest = (userId: string) => {
    sendRequest.mutate(userId, {
      onSuccess: () => {
        setDebouncedQuery('');
        setSearchQuery('');
      },
    });
  };

  // Filter out existing friends from search results
  const filteredSearchResults = searchResults?.filter(
    (user) => !friends?.some((friend) => friend.id === user.id)
  );

  return (
    <AppShell>
      <PageHeader
        title="Friends"
        description="Connect with others and stay accountable together"
      />

      {/* Search Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            Find Friends
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search by username or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!searchQuery.trim() || searchLoading}>
              Search
            </Button>
          </form>

          {/* Search Results */}
          {debouncedQuery && (
            <div className="mt-5 pt-5 border-t border-border/60">
              {searchLoading ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} className="h-[68px] w-full rounded-xl" />
                  ))}
                </div>
              ) : filteredSearchResults && filteredSearchResults.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-[13px] text-muted-foreground">
                    Found {filteredSearchResults.length} user{filteredSearchResults.length !== 1 && 's'}
                  </p>
                  {filteredSearchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border/40 transition-colors hover:bg-muted/60"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-1 ring-border/50">
                          <AvatarFallback className="text-sm font-medium bg-muted">
                            {user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-[0.9375rem]">{user.username}</p>
                          <p className="text-[13px] text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleSendRequest(user.id)}
                        disabled={sendRequest.isPending}
                        className="gap-1.5 shadow-sm"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No users found matching "{debouncedQuery}"
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for Friends and Requests */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-9">
              <TabsTrigger value="friends" className="gap-2 text-[13px] px-3">
                <Users className="h-3.5 w-3.5" />
                Friends
                {friends && friends.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-[10px] px-1.5">
                    {friends.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="requests" className="gap-2 text-[13px] px-3">
                <Clock className="h-3.5 w-3.5" />
                Requests
                {requests && requests.length > 0 && (
                  <Badge variant="destructive" className="ml-1 text-[10px] px-1.5">
                    {requests.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-0">
          {activeTab === 'friends' ? (
            friendsError ? (
              <ErrorState onRetry={() => refetchFriends()} />
            ) : (
              <FriendList friends={friends} isLoading={friendsLoading} />
            )
          ) : requestsError ? (
            <ErrorState onRetry={() => refetchRequests()} />
          ) : (
            <FriendRequestList requests={requests} isLoading={requestsLoading} />
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
