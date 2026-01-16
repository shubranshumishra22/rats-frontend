import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Trophy, Flame, LogOut, Moon, Sun } from 'lucide-react';
import { AppShell } from '@/components/layout';
import { PageHeader } from '@/components/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth, useTheme } from '@/context';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <AppShell>
      <PageHeader
        title="Profile"
        description="Manage your account settings"
      />

      <div className="grid gap-6 max-w-2xl">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account Information</CardTitle>
            <CardDescription>Your personal details and stats</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-start gap-5">
              <Avatar className="h-16 w-16 ring-2 ring-border/40 ring-offset-2 ring-offset-background">
                <AvatarFallback className="text-lg font-semibold bg-muted">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 flex-1">
                <h3 className="text-lg font-semibold tracking-[-0.01em]">{user?.username}</h3>
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  {user?.email}
                </div>
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Joined {user?.createdAt ? formatDate(user.createdAt) : 'Unknown'}
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="text-center p-4 rounded-xl bg-muted/40 border border-border/40">
                <div className="inline-flex p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 mb-2">
                  <Trophy className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-2xl font-bold tabular-nums">{(user?.points ?? 0).toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Total Points</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/40 border border-border/40">
                <div className="inline-flex p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 mb-2">
                  <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-2xl font-bold tabular-nums">{user?.currentStreak ?? 0}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Current Streak</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/40 border border-border/40 col-span-2 sm:col-span-1">
                <div className="inline-flex p-2 rounded-lg bg-red-100 dark:bg-red-900/30 mb-2">
                  <Flame className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-2xl font-bold tabular-nums">{user?.longestStreak ?? 0}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Best Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preferences</CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/40">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-muted">
                  {resolvedTheme === 'dark' ? (
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Sun className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <Label htmlFor="dark-mode" className="text-sm font-medium">
                    Dark Mode
                  </Label>
                  <p className="text-[13px] text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
              </div>
              <Switch
                id="dark-mode"
                checked={resolvedTheme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between p-4 rounded-xl bg-destructive/5 border border-destructive/20">
              <div>
                <p className="font-medium text-sm">Log out</p>
                <p className="text-[13px] text-muted-foreground">Sign out of your account</p>
              </div>
              <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-2 shadow-sm">
                <LogOut className="h-3.5 w-3.5" />
                Log out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
