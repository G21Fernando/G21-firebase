import { useAdmin } from '@/hooks/useAdmin';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { Users, FileText } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { adminRole } = useAdmin();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <span className="text-xl font-semibold text-gray-900">
                G21 Admin
              </span>
              <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
                {adminRole}
              </span>
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/admin/users"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <Users className="h-4 w-4" />
                  <span>Users</span>
                </Link>
                <Link
                  to="/admin/content"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <FileText className="h-4 w-4" />
                  <span>Content</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={handleSignOut}
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;