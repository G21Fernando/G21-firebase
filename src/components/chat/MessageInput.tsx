import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface MessageInputProps {
  onSubmit: (e: React.FormEvent, message: string) => void;
  isLoading: boolean;
}

export const MessageInput = ({ onSubmit, isLoading }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    onSubmit(e, message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask about your progress, get song recommendations, or guitar advice..."
        className="flex-1"
        disabled={isLoading}
      />
      <Button type="submit" disabled={!message.trim() || isLoading}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
      </Button>
    </form>
  );
};