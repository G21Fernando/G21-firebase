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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasInitialMessage, setHasInitialMessage] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchMessages();
      const channel = supabase
        .channel('messages')
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
    }
  }, [session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const createWelcomeMessage = async () => {
    if (!session?.user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!profile) return;

      const { data: lastSession } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      let welcomeMessage = "I'm your guitar tutor assistant. I can help you with practice advice and song recommendations based on your skill level. ";
      
      if (profile.daily_practice_time > 0) {
        welcomeMessage += `\n\nI see you've practiced for ${Math.round(profile.daily_practice_time / 60)} minutes today. `;
      }
      
      if (lastSession) {
        welcomeMessage += `Your last practice session was ${Math.round(lastSession.practice_duration / 60)} minutes long. `;
      }

      welcomeMessage += "\n\nWhat would you like to know?";

      const { error: aiMessageError } = await supabase
        .from('messages')
        .insert({
          content: welcomeMessage,
          user_id: 'ai-tutor',
          username: 'Guitar Tutor',
          is_ai: true
        });

      if (aiMessageError) throw aiMessageError;
      setHasInitialMessage(true);
    } catch (error) {
      console.error('Error creating welcome message:', error);
    }
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data);
    
    // If there are no messages, create a welcome message
    if (data.length === 0 && !hasInitialMessage) {
      createWelcomeMessage();
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user || !newMessage.trim()) return;
    setIsLoading(true);

    try {
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          content: newMessage.trim(),
          user_id: session.user.id,
          username: session.user.email?.split('@')[0] || 'Anonymous'
        });

      if (messageError) throw messageError;

      const { data: progressData } = await supabase
        .from('profiles')
        .select('points, practice_time, daily_practice_time')
        .eq('id', session.user.id)
        .single();

      const response = await supabase.functions.invoke('chat-with-tutor', {
        body: {
          message: newMessage.trim(),
          userProgress: progressData
        }
      });

      if (response.error) throw response.error;

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
      <ScrollArea className="flex-1 pr-4">
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
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
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