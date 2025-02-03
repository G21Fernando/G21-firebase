import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  content: string;
  username: string;
  is_ai?: boolean;
  user_id: string;
  created_at: string;
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

export const useChat = (userId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/auth');
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log('Fetching profile for user:', userId);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        console.log('Profile data:', data);
        setProfile(data);

        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;

        if (!messages || messages.length === 0) {
          const { error: welcomeError } = await supabase.from('messages').insert({
            content: "Hey! I'm your guitar tutor assistant. I can help you with practice advice and song recommendations based on your skill level. What would you like to know?",
            user_id: 'ai-tutor',
            username: 'Guitar Tutor',
            is_ai: true
          });
          if (welcomeError) throw welcomeError;
        } else {
          setMessages(messages);
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error fetching data",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    fetchProfile();

    // Set up realtime subscription
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
  }, [userId, navigate, toast]);

  const sendMessage = async (content: string) => {
    if (!userId || !content.trim() || !profile || isLoading) {
      console.log('Cannot send message, checks failed:', {
        hasUserId: !!userId,
        hasContent: !!content.trim(),
        hasProfile: !!profile,
        isLoading
      });
      return;
    }

    setIsLoading(true);
    console.log('Starting message send process...', {
      userId,
      content,
      profileId: profile.id
    });

    try {
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          content: content.trim(),
          user_id: userId,
          username: profile.username
        });

      if (messageError) {
        console.error('Error inserting user message:', messageError);
        throw messageError;
      }
      console.log('User message inserted successfully');

      // Get the current session
      console.log('Getting current session...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session retrieved:', session ? 'Yes' : 'No');
      
      if (!session?.access_token) {
        console.error('No access token in session');
        throw new Error('No access token available');
      }

      // Call the v2 Edge Function with authorization
      console.log('Preparing Edge Function call...');
      const payload = {
        message: content.trim(),
        userProgress: {
          points: profile.points,
          practice_time: profile.practice_time,
          daily_practice_time: profile.daily_practice_time,
          daily_points: profile.daily_points,
          user_id: userId
        }
      };
      console.log('Edge Function payload:', payload);
      
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'chat-with-tutor-v2',
        {
          body: JSON.stringify(payload),
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        }
      );

      if (functionError) {
        console.error('Edge Function error:', functionError);
        console.error('Full error details:', JSON.stringify(functionError, null, 2));
        throw functionError;
      }
      console.log('AI response received:', functionData);

      const { error: aiMessageError } = await supabase
        .from('messages')
        .insert({
          content: functionData.response,
          user_id: 'ai-tutor',
          username: 'Guitar Tutor',
          is_ai: true
        });

      if (aiMessageError) throw aiMessageError;
    } catch (error: any) {
      console.error('Error in chat flow:', error);
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    profile
  };
};