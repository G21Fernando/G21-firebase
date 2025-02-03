import { useState, useEffect, useCallback } from 'react';
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

  const fetchInitialData = useCallback(async () => {
    if (!userId) {
      navigate('/auth');
      return;
    }

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      if (!messagesData || messagesData.length === 0) {
        const welcomeMessage = {
          content: "Hey! I'm your guitar tutor assistant. I can help you with practice advice and song recommendations based on your skill level. What would you like to know?",
          user_id: 'ai-tutor',
          username: 'Guitar Tutor',
          is_ai: true
        };

        const { error: welcomeError } = await supabase
          .from('messages')
          .insert(welcomeMessage);

        if (welcomeError) throw welcomeError;
        setMessages([welcomeMessage as Message]);
      } else {
        setMessages(messagesData);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error fetching data",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [userId, navigate, toast]);

  useEffect(() => {
    fetchInitialData();

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages(prev => {
            const exists = prev.some(msg => msg.id === payload.new.id);
            if (exists) return prev;
            return [...prev, payload.new as Message];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchInitialData]);

  const sendMessage = async (content: string) => {
    if (!userId || !content.trim() || !profile || isLoading) return;

    setIsLoading(true);
    console.log('Sending message...');

    try {
      // First, insert the user's message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          content: content.trim(),
          user_id: userId,
          username: profile.username
        });

      if (messageError) throw messageError;

      // Get the current session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No access token available');
      }

      console.log('Calling edge function with payload...');
      
      // Prepare the payload for the edge function
      const payload = {
        message: content.trim(),
        userProgress: {
          points: profile.points || 0,
          practice_time: profile.practice_time || 0,
          daily_practice_time: profile.daily_practice_time || 0,
          daily_points: profile.daily_points || 0,
          user_id: userId
        }
      };

      console.log('Edge function payload:', payload);
      
      // Call the edge function with proper authentication
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'chat-with-tutor-v2',
        {
          body: JSON.stringify(payload),
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Edge function response:', functionData);

      if (functionError) {
        console.error('Edge function error:', functionError);
        throw functionError;
      }

      if (!functionData?.response) {
        console.error('No response from edge function');
        throw new Error('No response from AI tutor');
      }

      // Insert the AI's response
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