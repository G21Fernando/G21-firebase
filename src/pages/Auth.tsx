
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAuth } from 'firebase/auth';
import { signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import { useAuth } from '@/hooks/useAuth';
import app from '@/integrations/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/';
  const user = useAuth(); // Use the custom hook


  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
 await signInWithRedirect(auth, provider);
    } catch (error: any) {
 console.error("Google sign-in error:", error);
 toast({
        title: "Google Sign-in Failed",
        description: error.message,
        variant: "destructive"
 });
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from);
      // Then show toast after a small delay to ensure navigation completes
      setTimeout(() => {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      }, 500);
    }
  }, [user, navigate, from, toast]); // Added toast to dependency array

  const handleSignIn = (email: string, password: string) => { // This function is no longer needed for the current implementation using redirect, but keeping it for structure
  };
  const handleBackToPractice = () => {
 navigate('/');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // For now, we'll just log that the form was submitted
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
        
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
 <div className="grid gap-2">
 <Label htmlFor="email">Email</Label>
 <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
 <div className="grid gap-2">
 <Label htmlFor="password">Password</Label>
 <Input id="password" type="password" required />
          </div>
 <Button type="submit" className="w-full">
 Sign In
          </Button>
        </form>

 <div className="relative mt-6">
 <div className="absolute inset-0 flex items-center">
 <span className="w-full border-t" />
          </div>
 <div className="relative flex justify-center text-xs uppercase">
 <span className="bg-white px-2 text-muted-foreground">
 Or continue with
            </span>
          </div>
        </div>
 <Button variant="outline" className="w-full mt-4" onClick={handleGoogleSignIn}>
 {/* Add Google Icon here */}
 Google
        </Button>
        
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
