import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: string;
  details: any;
  created_at: string;
  profiles: {
    username: string;
  };
}

const LiveFeed = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    // Initial fetch of recent activities
    const fetchActivities = async () => {
      const { data, error } = await supabase
        .from('user_activity_logs')
        .select(`
          *,
          profiles:profiles(username)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching activities:', error);
        return;
      }

      if (data) {
        setActivities(data);
      }
    };

    fetchActivities();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('public:user_activity_logs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_activity_logs'
        },
        async (payload) => {
          // Fetch the complete activity data including profile
          const { data, error } = await supabase
            .from('user_activity_logs')
            .select(`
              *,
              profiles:profiles(username)
            `)
            .eq('id', payload.new.id)
            .single();

          if (error) {
            console.error('Error fetching new activity:', error);
            return;
          }

          if (data) {
            setActivities(prev => [data, ...prev].slice(0, 10));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getActivityMessage = (activity: ActivityLog) => {
    const username = activity.profiles?.username || 'Someone';
    const timeAgo = formatDistanceToNow(new Date(activity.created_at), { addSuffix: true });

    switch (activity.activity_type) {
      case 'chord_sprinter_start':
        return `${username} started Chord Sprinter ${timeAgo}`;
      case 'metronome_start':
        return `${username} started practicing with The Timekeeper ${timeAgo}`;
      case 'chat_message':
        return `${username} asked a question to the Guitar Tutor ${timeAgo}`;
      default:
        return `${username} performed an activity ${timeAgo}`;
    }
  };

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Live Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="text-sm text-gray-600 border-l-2 border-blue-500 pl-3 py-1"
              >
                {getActivityMessage(activity)}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LiveFeed;