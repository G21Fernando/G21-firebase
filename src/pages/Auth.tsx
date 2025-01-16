import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Add cache prevention headers
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Cache-Control';
    meta.content = 'no-cache, no-store, must-revalidate';
    document.head.appendChild(meta);

    const pragma = document.createElement('meta');
    pragma.httpEquiv = 'Pragma';
    pragma.content = 'no-cache';
    document.head.appendChild(pragma);

    const expires = document.createElement('meta');
    expires.httpEquiv = 'Expires';
    expires.content = '0';
    document.head.appendChild(expires);

    // Clean up function
    return () => {
      document.head.removeChild(meta);
      document.head.removeChild(pragma);
      document.head.removeChild(expires);
    };
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        navigate("/");
      }
      if (event === "SIGNED_OUT") {
        setError(null);
      }
      // Handle authentication errors
      if (event === "SIGNED_OUT") {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please check your credentials and try again.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5E6DB' }}>
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-4">
          <img 
            src="/lovable-uploads/5bfe01d1-1192-497c-a049-12e321aea77a.png" 
            alt="G21 Logo" 
            className="h-12 mb-2"
          />
        </div>
        <h1 className="text-2xl font-bold text-center text-[#1A1F2C] mb-6">
          Stop scrolling Start strumming
        </h1>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#1A1F2C',
                  brandAccent: '#2A2F3C',
                }
              }
            },
            className: {
              message: 'text-center text-sm text-red-600 bg-red-50 rounded p-2',
            }
          }}
          providers={[]}
          view="sign_in"
          redirectTo={window.location.origin}
        />
        <div className="mt-6 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-[#1A1F2C] hover:text-[#2A2F3C]"
          >
            Back to Practice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;