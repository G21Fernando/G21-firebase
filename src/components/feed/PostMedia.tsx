import { supabase } from "@/integrations/supabase/client";

interface PostMediaProps {
  mediaUrl: string;
  mediaType: 'video' | 'image';
}

const PostMedia = ({ mediaUrl, mediaType }: PostMediaProps) => {
  if (!mediaUrl) return null;

  const publicUrl = supabase.storage.from('media').getPublicUrl(mediaUrl).data.publicUrl;

  return (
    <div className="mt-2 max-h-[180px] overflow-hidden rounded-lg">
      {mediaType === 'video' ? (
        <video
          src={publicUrl}
          controls
          className="w-full h-[180px] object-cover"
        />
      ) : (
        <img
          src={publicUrl}
          alt="Post media"
          className="w-full h-[180px] object-cover"
        />
      )}
    </div>
  );
};

export default PostMedia;