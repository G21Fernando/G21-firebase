import { useState, useEffect } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Trash2 } from "lucide-react";

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: any;
  onUpdate?: () => void;
}

export default function ProfileEditDialog({
  open,
  onOpenChange,
  profile,
  onUpdate,
}: ProfileEditDialogProps) {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState(profile?.username || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null);
  const { toast } = useToast();

  useEffect(() => {
    setUsername(profile?.username || "");
    setAvatarUrl(profile?.avatar_url || null);
  }, [profile]);

  const cleanupOldAvatar = async () => {
    if (!profile?.avatar_url || profile.avatar_url.includes('dicebear')) return;
    
    try {
      // Extract the file path from the URL
      const urlParts = profile.avatar_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      // Remove the old file
      await supabase.storage
        .from("avatars")
        .remove([fileName]);
    } catch (error) {
      console.error('Error cleaning up old avatar:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const fileName = `${session?.user?.id}-${Math.random()}.${fileExt}`;

      // Validate file type
      if (!["jpg", "jpeg", "png", "gif"].includes(fileExt || "")) {
        throw new Error("Invalid file type. Please upload a JPG, PNG, or GIF image.");
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size too large. Maximum size is 5MB.");
      }

      // Clean up old avatar file if exists
      await cleanupOldAvatar();

      // Upload the new file with content-type header
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          cacheControl: '3600',
          contentType: `image/${fileExt}`,
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session?.user?.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setAvatarUrl(publicUrl);
      
      toast({
        title: "Success",
        description: "Profile picture updated successfully!",
      });

      onUpdate?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePicture = async () => {
    try {
      if (!session?.user?.id) return;

      // Clean up old avatar file if exists
      await cleanupOldAvatar();

      // Generate a new default avatar
      const defaultUsername = username || session.user.email?.split('@')[0] || 'user';
      const defaultAvatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${defaultUsername}`;

      // Update profile to use default avatar
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: defaultAvatarUrl,
        })
        .eq("id", session.user.id);

      if (updateError) throw updateError;

      setAvatarUrl(defaultAvatarUrl);
      
      toast({
        title: "Success",
        description: "Profile picture removed successfully!",
      });

      onUpdate?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      if (!session?.user?.id) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          username: username || session.user.email?.split("@")[0],
        })
        .eq("id", session.user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      onUpdate?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <UserAvatar
              profilePicture={avatarUrl}
              userId={session?.user?.id}
              username={username}
              size="xl"
            />
            <div className="flex items-center gap-2">
              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
              <Label
                htmlFor="picture"
                className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
              >
                {uploading ? "Uploading..." : "Change Picture"}
              </Label>
              {avatarUrl && !avatarUrl.includes('dicebear') && (
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={handleRemovePicture}
                  title="Remove Picture"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              className="col-span-3 bg-muted"
              value={session?.user?.email || ""}
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              className="col-span-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={session?.user?.email?.split("@")[0]}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}