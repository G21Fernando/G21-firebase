import { supabase } from "@/integrations/supabase/client";

interface PostMediaProps {
  mediaUrl: string;
  mediaType: 'video' | 'image';
}

const PostMedia = ({ mediaUrl, mediaType }: PostMediaProps) => {
  if (!mediaUrl) return null;

  const publicUrl = supabase.storage.from('media').getPublicUrl(mediaUrl).data.publicUrl;

  return (
    <div className="mt-2 h-[180px] flex items-center justify-center bg-black/5 rounded-lg">
      {mediaType === 'video' ? (
        <video
          src={publicUrl}
          controls
          className="max-h-[180px] w-auto object-contain"
        />
      ) : (
        <img
          src={publicUrl}
          alt="Post media"
          className="max-h-[180px] w-auto object-contain"
        />
      )}
    </div>
  );
};

export default PostMedia;