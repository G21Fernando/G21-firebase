import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@supabase/auth-helpers-react";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const session = useSession();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        navigate("/");
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const handleBackToPractice = () => {
    navigate('/');
  };

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
          redirectTo={window.location.origin}
          onlyThirdPartyProviders={false}
        />
        
        <div className="mt-6 text-center">
          <Button 
            variant="ghost" 
            onClick={handleBackToPractice}
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