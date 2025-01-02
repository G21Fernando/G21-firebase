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
import { Spinner } from "@/components/ui/spinner";

interface ProfileEditDialogProps {
  currentUsername: string;
  currentAvatarUrl: string | null;
  userId: string;
  onProfileUpdate: () => void;
  onClose: () => void;
}

const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({
  currentUsername,
  currentAvatarUrl,
  userId,
  onProfileUpdate,
  onClose,
}) => {
  const [username, setUsername] = useState(currentUsername);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl || '');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
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
      setOpen(false);
      onClose();
      
      // Add a small delay before refreshing to ensure the toast is visible
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="Enter avatar URL"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner size={16} /> Saving...
              </div>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;