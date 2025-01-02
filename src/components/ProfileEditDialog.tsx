import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProfileEditForm from './profile/ProfileEditForm';

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
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    onClose();
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
        <ProfileEditForm
          currentUsername={currentUsername}
          currentAvatarUrl={currentAvatarUrl}
          userId={userId}
          onProfileUpdate={onProfileUpdate}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;