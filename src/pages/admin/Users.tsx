import { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { AdminRole } from '@/hooks/useAdmin';

interface AdminUser {
  id: string;
  role: AdminRole;
  created_at: string;
  updated_at: string;
}

interface Profile {
  id: string;
  username: string;
  points: number | null;
  practice_time: number | null;
  created_at: string;
  admin_users: AdminUser[];
}

const UsersPage = () => {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          admin_users (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching users",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      return (data || []) as Profile[];
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Users Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Practice Time</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      {user.admin_users?.[0]?.role ? (
                        <Badge variant="secondary">{user.admin_users[0].role}</Badge>
                      ) : (
                        <Badge>user</Badge>
                      )}
                    </TableCell>
                    <TableCell>{user.points || 0}</TableCell>
                    <TableCell>{user.practice_time || 0} minutes</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default UsersPage;