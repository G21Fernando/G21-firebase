import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { Guitar } from "lucide-react";

interface ActivityLog {
  id: string;
  activity_type: string;
  points_earned: number;
  practice_time: number;
  details: any;
  created_at: string;
}

interface ActivityLogProps {
  userId: string;
}

const ActivityLog = ({ userId }: ActivityLogProps) => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data, error } = await supabase
          .from('user_activity_logs')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        setActivities(data || []);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [userId]);

  const formatActivity = (activity: ActivityLog) => {
    switch (activity.activity_type) {
      case 'metronome_practice':
        return `Practiced with metronome for ${Math.floor(activity.practice_time / 60)} minutes`;
      case 'chord_sprint':
        return `Completed chord sprint with ${activity.details?.reps || 0} transitions`;
      default:
        return activity.activity_type;
    }
  };

  if (loading) {
    return <div>Loading activities...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Playtime Log</CardTitle>
        <p className="text-sm text-muted-foreground">Today:</p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="mb-4 p-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <Guitar className="h-4 w-4 text-[#11245A]" />
                    <p className="text-sm font-medium">
                      {activity.points_earned > 0 ? "Grit Level:" : formatActivity(activity)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </p>
                </div>
                {activity.points_earned > 0 && (
                  <span className="text-sm font-semibold text-[#11245A]">
                    +{activity.points_earned} points
                  </span>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityLog;