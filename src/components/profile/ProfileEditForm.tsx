import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ProfileEditFormProps {
  currentUsername: string;
  currentAvatarUrl: string | null;
  userId: string;
  onProfileUpdate: () => void;
  onClose: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  currentUsername,
  currentAvatarUrl,
  userId,
  onProfileUpdate,
  onClose,
}) => {
  const [username, setUsername] = useState(currentUsername);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (currentAvatarUrl) {
      if (currentAvatarUrl.startsWith('http')) {
        setPreviewUrl(currentAvatarUrl);
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(currentAvatarUrl);
        setPreviewUrl(publicUrl);
      }
    }
  }, [currentAvatarUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDeleteAvatar = async () => {
    setIsLoading(true);
    try {
      if (currentAvatarUrl && !currentAvatarUrl.startsWith('http')) {
        await supabase.storage
          .from('avatars')
          .remove([currentAvatarUrl]);
      }

      const defaultAvatar = `https://api.multiavatar.com/${userId}.svg`;
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: defaultAvatar })
        .eq('id', userId);

      if (error) throw error;

      setPreviewUrl(defaultAvatar);
      setSelectedFile(null);
      
      toast({
        title: "Avatar reset to default!",
        duration: 3000,
      });
      
      onProfileUpdate();
    } catch (error) {
      console.error('Avatar deletion error:', error);
      toast({
        title: "Error resetting avatar",
        description: "Please try again later.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let avatarUrl = currentAvatarUrl;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `${userId}/avatar.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, selectedFile, { upsert: true });

        if (uploadError) throw uploadError;
        avatarUrl = filePath;
      }

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
      onClose();
    } catch (error) {
      console.error('Profile update error:', error);
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

  const defaultAvatarUrl = `https://api.multiavatar.com/${userId}.svg`;
  const avatarSrc = previewUrl || defaultAvatarUrl;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={avatarSrc} alt={username} />
            <AvatarFallback>
              <img src={defaultAvatarUrl} alt={username} className="w-full h-full" />
            </AvatarFallback>
          </Avatar>
          {(previewUrl || currentAvatarUrl) && !avatarSrc.includes('multiavatar.com') && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -bottom-2 -right-2"
              onClick={handleDeleteAvatar}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="avatar">Profile Picture</Label>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Spinner /> : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileEditForm;