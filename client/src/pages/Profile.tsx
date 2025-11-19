import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  X,
  Copy,
  Crown,
  Cake,
  MapPin,
  ChevronRight,
  User as UserIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileProps {
  onClose: () => void;
}

interface ProfileData {
  userId: string;
  username: string;
  birthday: string;
  gender: string;
  location: string;
  avatar?: string;
  email?: string;
}

export default function Profile({ onClose }: ProfileProps) {
  const { toast } = useToast();

  // Generate or retrieve user ID from localStorage
  const getUserId = () => {
    let userId = localStorage.getItem('talkastranger_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      localStorage.setItem('talkastranger_user_id', userId);
    }
    return userId;
  };

  const [profile, setProfile] = useState<ProfileData>({
    userId: getUserId(),
    username: "User",
    birthday: "1991-04-26",
    gender: "male",
    location: "Lahore",
    avatar: "",
    email: "",
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const userId = getUserId();
    fetch(`/profile/get?userId=${userId}`)
      .then((res) => res.json())
      .then((data: ProfileData) => setProfile({...data, userId}))
      .catch((err) => console.error("Failed to fetch profile:", err));
  }, []);

  const handleCopyId = () => {
    navigator.clipboard.writeText(profile.userId);
    toast({ title: "Copied!", description: "User ID copied to clipboard" });
  };

  const handleSave = async () => {
    try {
      const userId = getUserId();
      const res = await fetch("/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...profile, userId}),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        toast({ 
          title: "Error", 
          description: data.error || "Failed to update profile",
          variant: "destructive"
        });
        return;
      }

      setProfile({...data, userId}); // Preserve userId in state
      toast({ title: "Saved!", description: "Profile updated successfully" });
      setEditing(false);
    } catch (error) {
      console.error("Profile save error:", error);
      toast({ 
        title: "Error", 
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };


  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen p-4 pb-20">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-2">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-profile">
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Profile is always editable */}

          {/* Profile Card */}
          <Card className="mb-4">
            <CardContent className="p-6">
              {/* Avatar and Edit Button */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    {profile.avatar && <AvatarImage src={profile.avatar} alt={profile.username} />}
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      <UserIcon className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{profile.username}</h2>
                    <p className="text-sm text-muted-foreground">ID: {profile.userId}</p>
                  </div>
                </div>
                {editing ? (
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" onClick={handleSave} data-testid="button-save-profile">
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(false)}
                      data-testid="button-cancel-edit"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setEditing(true)}
                    data-testid="button-edit-profile"
                  >
                    Edit
                  </Button>
                )}
              </div>

              {/* Profile Fields */}
              <div className="space-y-4">
                {/* Username */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Username
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-input rounded-md"
                      data-testid="input-username"
                    />
                  ) : (
                    <p className="text-foreground" data-testid="text-username">{profile.username}</p>
                  )}
                </div>

                {/* Birthday */}
                <div className="flex items-center gap-3">
                  <Cake className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      Birthday
                    </label>
                    {editing ? (
                      <input
                        type="date"
                        value={profile.birthday}
                        onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md"
                        data-testid="input-birthday"
                      />
                    ) : (
                      <p className="text-foreground" data-testid="text-birthday">{profile.birthday}</p>
                    )}
                  </div>
                </div>

                {/* Gender */}
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      Gender
                    </label>
                    {editing ? (
                      <select
                        value={profile.gender}
                        onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md"
                        data-testid="input-gender"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <p className="text-foreground capitalize" data-testid="text-gender">{profile.gender}</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      Location
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md"
                        data-testid="input-location"
                      />
                    ) : (
                      <p className="text-foreground" data-testid="text-location">{profile.location}</p>
                    )}
                  </div>
                </div>

                {/* Email (if logged in with Google) */}
                {profile.email && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      Email
                    </label>
                    <p className="text-foreground" data-testid="text-email">{profile.email}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* More Card */}
          <Card>
            <CardContent className="p-4">
              <button className="w-full flex items-center justify-between hover-elevate active-elevate-2 rounded-lg p-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📋</span>
                  <span className="font-medium">More</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
