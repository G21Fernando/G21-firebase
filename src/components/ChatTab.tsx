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
  const [isInitialized, setIsInitialized] = useState(false);
  const initializationRef = useRef(false);

  // Check session and redirect if not authenticated
  useEffect(() => {
    if (!session) {
      navigate('/auth');
    }
  }, [session, navigate]);

  useEffect(() => {
    if (session?.user && !initializationRef.current) {
      console.log('Initializing chat...');
      initializationRef.current = true;
      fetchProfile();
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
            console.log('New message received:', payload);
            setMessages(prev => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        console.log('Cleaning up subscription...');
        supabase.removeChannel(channel);
      };
    }
  }, [session]);

  const fetchProfile = async () => {
    if (!session?.user) {
      navigate('/auth');
      return;
    }

    try {
      console.log('Fetching profile...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        if (error.code === 'PGRST116' || error.message.includes('JWT')) {
          navigate('/auth');
          return;
        }
        toast({
          title: "Error fetching profile",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Profile fetched:', data);
      setProfile(data);
      if (!isInitialized) {
        await createWelcomeMessage(data);
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      console.log('Fetching messages...');
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error fetching messages",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Messages fetched:', data);
      setMessages(data || []);
    } catch (error) {
      console.error('Error in fetchMessages:', error);
    }
  };

  const createWelcomeMessage = async (userProfile: Profile) => {
    if (!session?.user || isInitialized) return;

    try {
      console.log('Creating welcome message...');
      const { data: lastSession } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { data: chordResults } = await supabase
        .from('chord_sprinter_results')
        .select('reps')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      let welcomeMessage = `Hey ${userProfile.username}! 👋 I'm your guitar practice buddy! `;
      
      if (userProfile.points > 0) {
        welcomeMessage += `You've earned ${userProfile.points} points so far - that's awesome! `;
      }
      
      if (userProfile.daily_practice_time > 0) {
        welcomeMessage += `Today you've already practiced for ${Math.round(userProfile.daily_practice_time / 60)} minutes. Keep it up! `;
      }
      
      if (lastSession) {
        welcomeMessage += `Your last practice session was ${Math.round(lastSession.practice_duration / 60)} minutes long. `;
      }

      if (chordResults) {
        welcomeMessage += `And I see you've been working on your chord transitions - ${chordResults.reps} changes in your last sprint! `;
      }

      welcomeMessage += "\n\nI'm here to help you level up your guitar skills. What would you like to work on today? We could:\n";
      welcomeMessage += "• Review your progress and set new goals\n";
      welcomeMessage += "• Get song recommendations based on your current level\n";
      welcomeMessage += "• Plan your next practice session\n";
      welcomeMessage += "• Or anything else you'd like to discuss!";

      const { error: aiMessageError } = await supabase
        .from('messages')
        .insert({
          content: welcomeMessage,
          user_id: 'ai-tutor',
          username: 'Guitar Tutor',
          is_ai: true
        });

      if (aiMessageError) {
        console.error('Error creating welcome message:', aiMessageError);
        throw aiMessageError;
      }
      
      console.log('Welcome message created successfully');
    } catch (error) {
      console.error('Error creating welcome message:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user || !newMessage.trim() || !profile) {
      if (!session?.user) {
        toast({
          title: "Session expired",
          description: "Please log in again to continue chatting",
          variant: "destructive",
        });
        navigate('/auth');
      }
      return;
    }
    setIsLoading(true);

    try {
      console.log('Starting message send process...');
      
      // First, insert the user's message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          content: newMessage.trim(),
          user_id: session.user.id,
          username: profile.username
        });

      if (messageError) throw messageError;

      console.log('User message inserted, calling Edge Function...');
      
      // Ensure we have a valid session before proceeding
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !currentSession) {
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
        body: JSON.stringify({
          message: newMessage.trim(),
          userProgress: {
            points: profile.points,
            practice_time: profile.practice_time,
            daily_practice_time: profile.daily_practice_time,
            daily_points: profile.daily_points,
            user_id: session.user.id
          }
        }),
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Edge Function response:', data);
      
      if (functionError) {
        console.error('Edge Function error:', functionError);
        throw functionError;
      }

      if (!data?.response) {
        console.error('No response from Edge Function');
        throw new Error('No response from AI tutor');
      }

      // Insert AI's response
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
      console.error('Error in chat:', error);
      if (error.message?.includes('refresh_token') || error.message?.includes('JWT')) {
        toast({
          title: "Session expired",
          description: "Please log in again to continue chatting",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }
      toast({
        title: "Error sending message",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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