import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import { useAdmin } from "@/hooks/useAdmin";
import { Loader2 } from "lucide-react";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const { isAdmin, isLoading } = useAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast({
        title: "Access denied",
        description: "You need admin privileges to access this page",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAdmin, isLoading, toast, navigate]);

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};