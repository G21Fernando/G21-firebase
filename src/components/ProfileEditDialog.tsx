import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileEditDialogProps {
  currentUsername: string;
  currentAvatarUrl: string | null;
  userId: string;
  onProfileUpdate: () => void;
}

const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({
  currentUsername,
  currentAvatarUrl,
  userId,
  onProfileUpdate,
}) => {
  const [username, setUsername] = useState(currentUsername);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl || '');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          avatar_url: avatarUrl,
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Profile updated successfully!",
        duration: 3000,
      });
      
      onProfileUpdate();
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="Enter avatar URL"
            />
          </div>
          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;