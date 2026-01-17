import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Target, Flame, Trophy, MessageCircle } from 'lucide-react';
import { usersApi } from '@/api/users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FriendActionButton } from '@/components/common/FriendActionButton';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { messagesApi } from '@/api/messages';

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['userProfile', username],
    queryFn: () => usersApi.getPublicProfile(username!),
    enabled: !!username,
  });

  const isOwnProfile = currentUser?.username === username;

  const handleSendMessage = async () => {
    if (!profile) return;
    try {
      const conversation = await messagesApi.getOrCreateConversation(profile.id);
      navigate(`/app/messages/${conversation.id}`);
    } catch {
      // Error handled by API
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-xl font-semibold text-foreground mb-2">User not found</h2>
        <p className="text-muted-foreground">@{username} doesn't exist or has been removed.</p>
      </div>
    );
  }

  const stats = [
    { label: 'Points', value: profile.stats.points.toLocaleString(), icon: Trophy },
    { label: 'Current Streak', value: profile.stats.currentStreak, icon: Flame },
    { label: 'Longest Streak', value: profile.stats.longestStreak, icon: Flame },
    { label: 'Goals Completed', value: profile.stats.goalsCompleted, icon: Target },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24 ring-2 ring-border">
              <AvatarImage src={profile.avatarUrl || undefined} alt={profile.displayName} />
              <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                {profile.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground truncate">
                    {profile.displayName}
                  </h1>
                  <p className="text-muted-foreground">@{profile.username}</p>
                </div>

                {!isOwnProfile && (
                  <div className="flex gap-2">
                    <FriendActionButton userId={profile.id} />
                    <Button variant="outline" size="icon" onClick={handleSendMessage}>
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {profile.bio && (
                <p className="mt-3 text-foreground/80">{profile.bio}</p>
              )}

              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
