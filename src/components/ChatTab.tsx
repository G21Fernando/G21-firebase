import { useEffect, useState, useRef } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  created_at: string;
  username: string;
  user_id: string;
  is_ai?: boolean;
}

const ChatTab = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages update
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data.reverse());
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user || !newMessage.trim()) return;
    setIsLoading(true);

    try {
      // First, save the user's message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          content: newMessage.trim(),
          user_id: session.user.id,
          username: session.user.email?.split('@')[0] || 'Anonymous'
        });

      if (messageError) throw messageError;

      // Get user progress for context
      const { data: progressData } = await supabase
        .from('profiles')
        .select('points, practice_time, daily_practice_time')
        .eq('id', session.user.id)
        .single();

      // Get AI response
      const response = await supabase.functions.invoke('chat-with-tutor', {
        body: {
          message: newMessage.trim(),
          userProgress: progressData
        }
      });

      if (response.error) throw response.error;

      // Save AI response
      const { error: aiMessageError } = await supabase
        .from('messages')
        .insert({
          content: response.data.response,
          user_id: 'ai-tutor',
          username: 'Guitar Tutor',
          is_ai: true
        });

      if (aiMessageError) throw aiMessageError;

      setNewMessage('');
    } catch (error) {
      console.error('Error in chat:', error);
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] p-4">
      <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg ${
                message.user_id === session?.user?.id
                  ? 'bg-primary text-primary-foreground ml-auto'
                  : message.is_ai
                  ? 'bg-secondary'
                  : 'bg-muted'
              } max-w-[80%] break-words ${
                message.user_id === session?.user?.id ? 'ml-auto' : ''
              }`}
            >
              <div className="font-semibold text-sm">
                {message.username}
              </div>
              <div>{message.content}</div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <form onSubmit={sendMessage} className="flex gap-2 mt-4">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask about your progress, get song recommendations, or guitar advice..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={!newMessage.trim() || isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
        </Button>
      </form>
    </div>
  );
};

export default ChatTab;