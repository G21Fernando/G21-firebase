import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProfileEditForm from './profile/ProfileEditForm';

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: any;
  onUpdate: () => void;
}

const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({
  open,
  onOpenChange,
  profile,
  onUpdate,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <ProfileEditForm
          currentUsername={profile?.username || ''}
          currentAvatarUrl={profile?.avatar_url || null}
          userId={profile?.id || ''}
          onProfileUpdate={onUpdate}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;