import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentAvatarUrl 
      ? supabase.storage.from('avatars').getPublicUrl(currentAvatarUrl).data.publicUrl 
      : null
  );
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('userId', userId);

        const { data, error: functionError } = await supabase.functions.invoke('optimize-avatar', {
          body: formData,
        });

        if (functionError) {
          throw functionError;
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update({ username })
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={previewUrl || '/placeholder.svg'} alt={username} />
          <AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="space-y-2 w-full">
          <Label htmlFor="avatar">Profile Picture</Label>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isLoading}
          />
          <p className="text-sm text-gray-500">
            Maximum file size: 5MB. The image will be optimized automatically.
          </p>
        </div>
      </div>
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
  );
};

export default ProfileEditForm;