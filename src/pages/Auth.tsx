import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AuthChangeEvent } from "@supabase/supabase-js";

const AuthPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      if (event === "SIGNED_IN") {
        setIsLoading(true);
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session?.user?.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching profile:', profileError);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to fetch user profile. Please try again.",
            });
            return;
          }

          navigate("/");
          toast({
            title: "Welcome back!",
            description: `You've successfully signed in${profile?.username ? `, ${profile.username}` : ''}!`,
          });
        } catch (err) {
          console.error('Error during sign in:', err);
          setError('An unexpected error occurred. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
      if (event === "SIGNED_OUT") {
        setError(null);
        toast({
          title: "Signed out",
          description: "You've been successfully signed out.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleBackToPractice = () => {
    setError(null);
    navigate('/', { replace: true, state: { skipAuthCheck: true } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5E6DB' }}>
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-[#1A1F2C] mb-8">
          Stop scrolling Start strumming
        </h1>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {isLoading && (
          <div className="flex justify-center items-center mb-4">
            <Loader2 className="h-6 w-6 animate-spin text-[#1A1F2C]" />
          </div>
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
              button: 'bg-[#1A1F2C] hover:bg-[#2A2F3C] text-white font-medium py-2 px-4 rounded transition-colors',
              input: 'border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#1A1F2C]',
              label: 'block text-sm font-medium text-gray-700 mb-1',
            }
          }}
          providers={[]}
          redirectTo={window.location.origin}
          onlyThirdPartyProviders={false}
          magicLink={false}
          showLinks={true}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Sign in',
                email_input_placeholder: 'Your email address',
                password_input_placeholder: 'Your password',
              },
              sign_up: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Sign up',
                email_input_placeholder: 'Your email address',
                password_input_placeholder: 'Choose a password',
              },
            },
          }}
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