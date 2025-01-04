import { supabase } from "@/integrations/supabase/client";

interface PostMediaProps {
  mediaUrl: string;
  mediaType: 'video' | 'image';
}

const PostMedia = ({ mediaUrl, mediaType }: PostMediaProps) => {
  if (!mediaUrl) return null;

  const publicUrl = supabase.storage.from('media').getPublicUrl(mediaUrl).data.publicUrl;

  return (
    <div className="mt-4 max-h-[200px] overflow-hidden">
      {mediaType === 'video' ? (
        <video
          src={publicUrl}
          controls
          className="w-full h-full object-contain rounded-lg"
        />
      ) : (
        <img
          src={publicUrl}
          alt="Post media"
          className="w-full h-full object-contain rounded-lg"
        />
      )}
    </div>
  );
};

export default PostMedia;