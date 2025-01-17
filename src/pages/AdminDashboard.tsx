import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface Profile {
  id: string;
  username: string;
  points: number;
  practice_time: number;
}

const AdminDashboard = () => {
  const session = useSession();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);

  useEffect(() => {
    if (session) {
      fetchUsers();
      fetchProfiles();
      fetchActivityData();
    }
  }, [session]);

  const fetchUsers = async () => {
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, username, points, practice_time')
        .order('points', { ascending: false });

      if (error) throw error;
      setProfiles(users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error fetching users",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(profiles || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: "Error fetching profiles",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const fetchActivityData = async () => {
    try {
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      const { data: sessions, error } = await supabase
        .from('user_sessions')
        .select('session_start, practice_duration')
        .gte('session_start', thirtyDaysAgo);

      if (error) throw error;

      // Process data for chart
      const activityByDay = new Map();
      sessions?.forEach(session => {
        const date = format(new Date(session.session_start), 'MMM dd');
        activityByDay.set(date, (activityByDay.get(date) || 0) + 1);
      });

      const chartData = Array.from(activityByDay.entries()).map(([date, count]) => ({
        date,
        sessions: count
      }));

      setActivityData(chartData);
    } catch (error) {
      console.error('Error fetching activity data:', error);
      toast({
        title: "Error fetching activity data",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5E6DB]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 text-[#11245A]">Admin Dashboard</h1>
        
        {/* Activity Overview */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Daily Activity</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sessions" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* User List */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Practice Time (min)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>{profile.username}</TableCell>
                    <TableCell>{profile.points}</TableCell>
                    <TableCell>{Math.round(profile.practice_time / 60)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Coming soon",
                            description: "User management features are coming soon",
                          });
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;