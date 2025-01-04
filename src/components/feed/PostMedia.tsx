import { supabase } from "@/integrations/supabase/client";

interface PostMediaProps {
  mediaUrl: string;
  mediaType: 'video' | 'image';
}

const PostMedia = ({ mediaUrl, mediaType }: PostMediaProps) => {
  if (!mediaUrl) return null;

  const publicUrl = supabase.storage.from('media').getPublicUrl(mediaUrl).data.publicUrl;

  return (
    <div className="mt-4">
      {mediaType === 'video' ? (
        <video
          src={publicUrl}
          controls
          className="w-full rounded-lg"
        />
      ) : (
        <img
          src={publicUrl}
          alt="Post media"
          className="w-full rounded-lg"
        />
      )}
    </div>
  );
};

export default PostMedia;