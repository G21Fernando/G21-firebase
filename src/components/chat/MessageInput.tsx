import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const MessageInput = ({ value, onChange, onSubmit, isLoading }: MessageInputProps) => {
  return (
    <form onSubmit={onSubmit} className="flex gap-2 mt-4">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ask about your progress, get song recommendations, or guitar advice..."
        className="flex-1"
        disabled={isLoading}
      />
      <Button type="submit" disabled={!value.trim() || isLoading}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
      </Button>
    </form>
  );
};