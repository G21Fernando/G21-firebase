import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from 'lucide-react';

interface PostHeaderProps {
  avatarUrl: string | null;
  username: string;
  createdAt: string;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PostHeader = ({ avatarUrl, username, createdAt, isOwner, onEdit, onDelete }: PostHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="flex items-center gap-4">
        <img
          src={avatarUrl || '/placeholder.svg'}
          alt={username}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h3 className="font-semibold">{username}</h3>
          <p className="text-sm text-gray-500">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      {isOwner && (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </CardHeader>
  );
};

export default PostHeader;