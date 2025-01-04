import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from 'lucide-react';

const CreatePost = ({ onPostCreated }: { onPostCreated: () => void }) => {
  const [content, setContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's a video
    if (file.type.startsWith('video/')) {
      // Create a video element to check duration
      const video = document.createElement('video');
      video.preload = 'metadata';

      const promise = new Promise((resolve, reject) => {
        video.onloadedmetadata = () => resolve(video.duration);
        video.onerror = reject;
        video.src = URL.createObjectURL(file);
      });

      try {
        const duration = await promise as number;
        if (duration > 20) {
          toast({
            title: "Video too long",
            description: "Basic users can only upload videos up to 20 seconds long.",
            variant: "destructive"
          });
          return;
        }
      } catch (error) {
        console.error('Error checking video duration:', error);
        return;
      }
    }

    setMediaFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaFile) return;

    setIsUploading(true);
    try {
      let mediaUrl = null;
      let mediaType = null;

      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('media')
          .upload(filePath, mediaFile);

        if (uploadError) throw uploadError;

        mediaUrl = data.path;
        mediaType = mediaFile.type.startsWith('video/') ? 'video' : 'image';
      }

      const { error } = await supabase
        .from('posts')
        .insert({
          content,
          media_url: mediaUrl,
          media_type: mediaType,
          video_duration: mediaType === 'video' ? 20 : null
        });

      if (error) throw error;

      setContent('');
      setMediaFile(null);
      onPostCreated();
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg p-4 shadow">
      <Textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px]"
      />
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <input
            type="file"
            id="media"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => document.getElementById('media')?.click()}
          >
            <Upload className="h-4 w-4" />
          </Button>
          {mediaFile && (
            <span className="text-sm text-gray-500">
              {mediaFile.name}
            </span>
          )}
        </div>
        <Button type="submit" disabled={isUploading}>
          {isUploading ? 'Posting...' : 'Post'}
        </Button>
      </div>
    </form>
  );
};

export default CreatePost;