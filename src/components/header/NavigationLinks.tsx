import { useLocation } from 'react-router-dom';
import { Users, Zap, Settings, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TimekeeperIcon from '../icons/TimekeeperIcon';
import { useAdmin } from '@/hooks/useAdmin';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavigationLinksProps {
  onNavigate: (path: string) => void;
}

const NavigationLinks = ({ onNavigate }: NavigationLinksProps) => {
  const location = useLocation();
  const { isAdmin, isLoading } = useAdmin();

  return (
    <div className="hidden md:flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={location.pathname === '/' ? 'ghost' : 'ghost'}
              size="icon"
              onClick={() => onNavigate('/')}
              className={location.pathname === '/' ? 'bg-[#F1F0FB] hover:bg-[#F1F0FB]' : ''}
            >
              <TimekeeperIcon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Timekeeper</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={location.pathname === '/sprinter' ? 'ghost' : 'ghost'}
              size="icon"
              onClick={() => onNavigate('/sprinter')}
              className={location.pathname === '/sprinter' ? 'bg-[#F1F0FB] hover:bg-[#F1F0FB]' : ''}
            >
              <Zap className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sprinter</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={location.pathname === '/tutor' ? 'ghost' : 'ghost'}
              size="icon"
              onClick={() => onNavigate('/tutor')}
              className={location.pathname === '/tutor' ? 'bg-[#F1F0FB] hover:bg-[#F1F0FB]' : ''}
            >
              <Compass className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tutor</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={location.pathname === '/feed' ? 'ghost' : 'ghost'}
              size="icon"
              onClick={() => onNavigate('/feed')}
              className={location.pathname === '/feed' ? 'bg-[#F1F0FB] hover:bg-[#F1F0FB]' : ''}
            >
              <Users className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Feed</p>
          </TooltipContent>
        </Tooltip>

        {isAdmin && !isLoading && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={location.pathname === '/admin' ? 'ghost' : 'ghost'}
                size="icon"
                onClick={() => onNavigate('/admin')}
                className={location.pathname === '/admin' ? 'bg-[#F1F0FB] hover:bg-[#F1F0FB]' : ''}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Admin</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};

export default NavigationLinks;