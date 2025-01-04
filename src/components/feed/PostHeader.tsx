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
    <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
      <div className="flex items-center gap-3">
        <img
          src={avatarUrl || '/placeholder.svg'}
          alt={username}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold text-sm">{username}</h3>
          <p className="text-xs text-gray-500">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      {isOwner && (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
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