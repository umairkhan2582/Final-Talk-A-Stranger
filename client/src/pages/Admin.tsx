import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Users, Video, Clock, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminStats {
  totalOnline: number;
  connectedPairs: Array<{
    user1: { username: string; country?: string };
    user2: { username: string; country?: string };
    matchedAt: Date;
  }>;
  waitingUsers: Array<{
    username: string;
    country?: string;
    waitingSince: Date;
  }>;
  idleUsers: Array<{
    country?: string;
    connectedAt: Date;
  }>;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [stats, setStats] = useState<AdminStats>({
    totalOnline: 0,
    connectedPairs: [],
    waitingUsers: [],
    idleUsers: [],
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    // Try to authenticate with server
    const socket: Socket = io({
      query: { adminPassword: password }
    });

    socket.on("admin-authenticated", (success: boolean) => {
      setIsLoading(false);
      if (success) {
        setIsAuthenticated(true);
        setError("");
      } else {
        setError("Incorrect password");
        setPassword("");
        socket.disconnect();
      }
    });

    socket.on("admin-stats", (newStats: AdminStats) => {
      setStats(newStats);
    });

    // Store socket reference for cleanup
    (window as any).adminSocket = socket;
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if ((window as any).adminSocket) {
        (window as any).adminSocket.disconnect();
      }
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Admin Login</h1>
            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  data-testid="input-admin-password"
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-destructive mt-2">{error}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                data-testid="button-admin-login"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Login"}
              </Button>
            </form>
            <p className="text-sm text-muted-foreground text-center">
              Password is stored securely in Replit Secrets
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/30">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold text-primary" data-testid="text-total-online">
              {stats.totalOnline} users online
            </span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Video className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-semibold text-card-foreground">Connected Pairs</h2>
            </div>
            <p className="text-3xl font-bold text-green-500" data-testid="text-connected-count">
              {stats.connectedPairs.length}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-card-foreground">Waiting</h2>
            </div>
            <p className="text-3xl font-bold text-yellow-500" data-testid="text-waiting-count">
              {stats.waitingUsers.length}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-muted-foreground" />
              <h2 className="text-xl font-semibold text-card-foreground">Browsing</h2>
            </div>
            <p className="text-3xl font-bold text-muted-foreground" data-testid="text-idle-count">
              {stats.idleUsers.length}
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-4 flex items-center gap-2">
              <Video className="w-6 h-6 text-green-500" />
              Active Video Chats
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.connectedPairs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No active chats</p>
              ) : (
                stats.connectedPairs.map((pair, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-green-500/10 border border-green-500/30"
                    data-testid={`pair-${index}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-card-foreground">
                          {pair.user1.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {pair.user1.country || "Unknown"}
                        </p>
                      </div>
                      <div className="text-muted-foreground px-4">⟷</div>
                      <div className="flex-1 text-right">
                        <p className="font-semibold text-card-foreground">
                          {pair.user2.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {pair.user2.country || "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-yellow-500" />
                Waiting for Match
              </h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {stats.waitingUsers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No one waiting</p>
                ) : (
                  stats.waitingUsers.map((user, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex justify-between"
                      data-testid={`waiting-${index}`}
                    >
                      <span className="font-medium text-card-foreground">{user.username}</span>
                      <span className="text-muted-foreground">{user.country || "Unknown"}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-muted-foreground" />
                Just Browsing
              </h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {stats.idleUsers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No idle users</p>
                ) : (
                  stats.idleUsers.map((user, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-card border border-card-border flex justify-between"
                      data-testid={`idle-${index}`}
                    >
                      <span className="text-muted-foreground">Visitor #{index + 1}</span>
                      <span className="text-muted-foreground">{user.country || "Unknown"}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
