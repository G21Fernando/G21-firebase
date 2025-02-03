import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface Profile {
  username: string;
  points: number;
  practice_time: number;
  avatar_url: string | null;
  daily_points: number;
  daily_practice_time: number;
}

interface ChordSprintData {
  chord_pair: string;
  reps: number;
  created_at: string;
}

const UserProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sprintData, setSprintData] = useState<ChordSprintData[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (profileData) {
        setProfile(profileData);

        const { data: sprintResults } = await supabase
          .from('chord_sprinter_results')
          .select('*')
          .eq('user_id', profileData.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (sprintResults) {
          setSprintData(sprintResults);
        }
      }
    };

    fetchProfile();
  }, [username]);

  if (!profile) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  const isMaestro = profile.practice_time >= 36000000; // 10000 hours in seconds

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <AvatarWithFallback
          username={profile.username}
          src={profile.avatar_url}
          size="lg"
        />
        <div className="flex items-center gap-2 mt-4">
          <h1 className="text-2xl font-bold">{profile.username}</h1>
          {isMaestro && (
            <HoverCard>
              <HoverCardTrigger>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                  MAESTRO
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <p className="text-sm text-muted-foreground">
                  This badge is awarded to users who have practiced for over 10,000 hours. 
                  This achievement is typically verified by administrators.
                </p>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Points</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{profile.points}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Practice Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Math.round(profile.practice_time / 60)} mins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">Points today: {profile.daily_points}</p>
            <p className="text-lg">Practice today: {Math.round(profile.daily_practice_time / 60)} mins</p>
          </CardContent>
        </Card>
      </div>

      {sprintData.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Chord Sprint Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sprintData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="chord_pair" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="reps" fill="#8884d8" name="Transitions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserProfile;