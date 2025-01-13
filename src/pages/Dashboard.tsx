import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartBar, ChartPie } from 'lucide-react';
import Header from '@/components/Header';

interface ChordSprintData {
  chord_pair: string;
  reps: number;
}

interface DailyStats {
  date: string;
  points: number;
  practice_time: number;
}

const Dashboard = () => {
  const session = useSession();
  const [sprintData, setSprintData] = useState<ChordSprintData[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [profile, setProfile] = useState<any>(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      // Fetch profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }

      // Fetch chord sprint results
      const { data: sprintResults } = await supabase
        .from('chord_sprinter_results')
        .select('chord_pair, reps')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false })
        .limit(6);

      if (sprintResults) {
        setSprintData(sprintResults);
      }

      // For demo purposes, generate some daily stats
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toLocaleDateString(),
          points: Math.floor(Math.random() * 100),
          practice_time: Math.floor(Math.random() * 60)
        };
      }).reverse();

      setDailyStats(last7Days);

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <div className="min-h-screen pb-16 md:pb-0" style={{ backgroundColor: '#F5E6DB' }}>
      <Header profile={profile} onProfileUpdate={fetchUserData} />
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-[#11245A]">Your Practice Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sprint Performance Chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center gap-2 mb-4">
              <ChartBar className="w-5 h-5 text-[#11245A]" />
              <h2 className="text-lg font-semibold text-[#11245A]">Sprint Performance</h2>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sprintData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="chord_pair" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="reps" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Practice Distribution */}
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center gap-2 mb-4">
              <ChartPie className="w-5 h-5 text-[#11245A]" />
              <h2 className="text-lg font-semibold text-[#11245A]">Practice Distribution</h2>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sprintData}
                    dataKey="reps"
                    nameKey="chord_pair"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {sprintData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Progress */}
          <div className="bg-white p-6 rounded-xl shadow md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <ChartBar className="w-5 h-5 text-[#11245A]" />
              <h2 className="text-lg font-semibold text-[#11245A]">Daily Progress</h2>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="points" fill="#8884d8" name="Points" />
                  <Bar yAxisId="right" dataKey="practice_time" fill="#82ca9d" name="Practice Time (min)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;