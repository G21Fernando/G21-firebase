import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { G21Assets } from '@/components/admin/G21Assets';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MetricCardProps {
  title: string;
  value: string;
  subValue: string;
  percentageChange: number;
}

const MetricCard = ({ title, value, subValue, percentageChange }: MetricCardProps) => (
  <Card className="p-6">
    <div className="space-y-2">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-semibold">{value}</p>
        <div className="text-sm">
          <span className="font-medium">{subValue}</span>
          <span className={`ml-2 ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {percentageChange > 0 ? '↑' : '↓'} {Math.abs(percentageChange)}%
          </span>
        </div>
      </div>
    </div>
  </Card>
);

const AdminDashboard = () => {
  const session = useSession();
  const [signupData, setSignupData] = useState<any[]>([]);
  const [engagementData, setEngagementData] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      // Fetch last 30 days of signups
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo);

      // Fetch engagement data (practice sessions)
      const { data: sessions } = await supabase
        .from('user_sessions')
        .select('session_start, practice_duration')
        .gte('session_start', thirtyDaysAgo);

      // Process data for charts
      const signupsByDay = new Map();
      const engagementByDay = new Map();

      profiles?.forEach(profile => {
        const date = format(new Date(profile.created_at), 'MMM dd');
        signupsByDay.set(date, (signupsByDay.get(date) || 0) + 1);
      });

      sessions?.forEach(session => {
        const date = format(new Date(session.session_start), 'MMM dd');
        engagementByDay.set(date, (engagementByDay.get(date) || 0) + 1);
      });

      // Convert to array format for charts
      const signupChartData = Array.from(signupsByDay.entries()).map(([date, count]) => ({
        date,
        value: count
      }));

      const engagementChartData = Array.from(engagementByDay.entries()).map(([date, count]) => ({
        date,
        value: count
      }));

      setSignupData(signupChartData);
      setEngagementData(engagementChartData);
    };

    if (session) {
      fetchAnalytics();
    }
  }, [session]);

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F5E6DB' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-[#11245A]">Admin Dashboard</h1>
        
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="g21-assets">G21 Assets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Signups */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4">User Signups</h2>
                <MetricCard
                  title="Daily, Last 30 Days"
                  value={signupData.length > 0 ? signupData[signupData.length - 1].value.toString() : "0"}
                  subValue={format(new Date(), 'MMM d')}
                  percentageChange={10}
                />
                <div className="h-[300px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={signupData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Engaged Users */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Engaged Users</h2>
                <MetricCard
                  title="Daily, Last 30 Days"
                  value={engagementData.length > 0 ? engagementData[engagementData.length - 1].value.toString() : "0"}
                  subValue={format(new Date(), 'MMM d')}
                  percentageChange={15}
                />
                <div className="h-[300px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="g21-assets">
            <G21Assets />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
