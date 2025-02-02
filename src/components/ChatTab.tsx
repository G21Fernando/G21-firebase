import { useEffect, useState, useRef } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  content: string;
  created_at: string;
  username: string;
  user_id: string;
  is_ai?: boolean;
}

interface Profile {
  id: string;
  username: string;
  points: number;
  practice_time: number;
  daily_practice_time: number;
  daily_points: number;
  last_practice_date: string;
}

const ChatTab = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Single initialization effect
  useEffect(() => {
    if (!session?.user?.id) {
      navigate('/auth');
      return;
    }

    const initializeChat = async () => {
      if (initialized.current) return;
      initialized.current = true;

      try {
        console.log('Fetching profile...');
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        console.log('Fetching messages...');
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;
        
        if (!messagesData?.length) {
          console.log('Creating welcome message...');
          await supabase
            .from('messages')
            .insert({
              content: `Hey! I'm your guitar tutor assistant. I can help you with practice advice and song recommendations based on your skill level. What would you like to know?`,
              user_id: 'ai-tutor',
              username: 'Guitar Tutor',
              is_ai: true
            });
        } else {
          setMessages(messagesData);
        }

      } catch (error: any) {
        console.error('Error initializing chat:', error);
        if (error.message?.includes('JWT')) {
          navigate('/auth');
        }
        toast({
          title: "Error initializing chat",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    initializeChat();

    // Set up real-time subscription
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          console.log('New message received:', payload);
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, navigate, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !newMessage.trim() || !profile || isLoading) return;

    setIsLoading(true);
    console.log('Sending message...');

    try {
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          content: newMessage.trim(),
          user_id: session.user.id,
          username: profile.username
        });

      if (messageError) throw messageError;
      console.log('User message sent, calling AI...');

      // Get current session
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !currentSession?.access_token) {
        console.error('Session error:', sessionError);
        toast({
          title: "Session expired",
          description: "Please log in again to continue chatting",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      // Call the Edge Function with user progress data and auth token
      const { data, error: functionError } = await supabase.functions.invoke('chat-with-tutor', {
        body: {
          message: newMessage.trim(),
          userProgress: {
            points: profile.points,
            practice_time: profile.practice_time,
            daily_practice_time: profile.daily_practice_time,
            daily_points: profile.daily_points,
            user_id: session.user.id
          }
        }
      });

      if (functionError) throw functionError;
      console.log('AI response received:', data);

      const { error: aiMessageError } = await supabase
        .from('messages')
        .insert({
          content: data.response,
          user_id: 'ai-tutor',
          username: 'Guitar Tutor',
          is_ai: true
        });

      if (aiMessageError) throw aiMessageError;
      setNewMessage('');
    } catch (error: any) {
      console.error('Error sending message:', error);
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