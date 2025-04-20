
import { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const { toast } = useToast();
  const hadSession = useRef(false);
  const sessionCheckTimeout = useRef<NodeJS.Timeout>();
  const initialCheckDone = useRef(false);
  const location = useLocation();

  useEffect(() => {
    if (!initialCheckDone.current) {
      if (session) {
        hadSession.current = true;
      }
      initialCheckDone.current = true;
      return;
    }

    if (sessionCheckTimeout.current) {
      clearTimeout(sessionCheckTimeout.current);
    }

    if (!session && hadSession.current) {
      sessionCheckTimeout.current = setTimeout(() => {
        toast({
          title: "Session expired",
          description: "Please log in again to continue",
          variant: "destructive",
        });
      }, 100);
    }
  }, [session, toast]);

  if (!session) {
    // Save the current location they were trying to go to
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};
