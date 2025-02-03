import React from 'react';
import { createRoot } from 'react-dom/client';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './integrations/supabase/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

// Add error boundary
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('React error boundary caught an error:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5E6DB]">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
            <p>Please try refreshing the page.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Initialize the app with error handling
try {
  console.log('Initializing app...');
  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Present' : 'Missing');
  console.log('Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing');

  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root element not found');
  }

  const root = createRoot(container);
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <SessionContextProvider 
          supabaseClient={supabase}
          initialSession={null}
        >
          <App />
        </SessionContextProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );

  console.log('App initialized successfully');
} catch (error) {
  console.error('Failed to initialize app:', error);
}
