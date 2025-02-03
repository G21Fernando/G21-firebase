import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useSession } from '@supabase/auth-helpers-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const session = useSession();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      if (event === 'SIGNED_IN' && session) {
        navigate('/');
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
    <div className="min-h-screen flex items-center justify-center bg-[#F5E6DB]">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <img 
            src="/lovable-uploads/5bfe01d1-1192-497c-a049-12e321aea77a.png" 
            alt="G21 Logo" 
            className="h-12 mb-4"
          />
          <h1 className="text-2xl font-bold text-center text-[#1A1F2C]">
            Stop scrolling Start strumming
          </h1>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#1A1F2C',
                  brandAccent: '#2A2F3C',
                  inputBackground: 'white',
                  inputText: '#1A1F2C',
                  inputBorder: '#E2E8F0',
                  inputBorderHover: '#CBD5E0',
                  inputBorderFocus: '#1A1F2C',
                }
              }
            },
            className: {
              container: 'flex flex-col gap-4',
              label: 'text-sm font-medium text-gray-700',
              input: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              button: 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full',
              anchor: 'text-sm text-gray-600 hover:text-gray-900 text-center block',
              message: 'text-center text-sm text-red-600 bg-red-50 rounded p-2',
            }
          }}
          providers={[]}
          redirectTo={window.location.origin}
          onlyThirdPartyProviders={false}
          view="sign_in"
        />
        
        <div className="mt-6 text-center">
          <Button 
            variant="ghost" 
            onClick={handleBackToPractice}
            className="text-[#1A1F2C] hover:text-[#2A2F3C] font-medium"
          >
            Back to Practice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;