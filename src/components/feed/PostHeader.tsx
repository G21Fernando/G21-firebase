import { Card, CardHeader } from "@/components/ui/card";

interface PostHeaderProps {
  avatarUrl: string | null;
  username: string;
  createdAt: string;
}

const PostHeader = ({ avatarUrl, username, createdAt }: PostHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center gap-4">
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
    </CardHeader>
  );
};

export default PostHeader;