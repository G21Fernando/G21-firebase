
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/hooks/useAdmin";
import { useLocation } from "react-router-dom";

type NavigationLinkProps = {
  onNavigate: (path: string) => void;
};

const NavigationLinks = ({ onNavigate }: NavigationLinkProps) => {
  const location = useLocation();
  const { isAdmin } = useAdmin();
  
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            onClick={() => onNavigate('/')}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
              location.pathname === '/' ? "font-bold" : ""
            )}
          >
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            onClick={() => onNavigate('/dashboard')}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
              location.pathname === '/dashboard' ? "font-bold" : ""
            )}
          >
            Dashboard
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            onClick={() => onNavigate('/feed')}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
              location.pathname === '/feed' ? "font-bold" : ""
            )}
          >
            Feed
          </NavigationMenuLink>
        </NavigationMenuItem>
        {isAdmin && (
          <NavigationMenuItem>
            <NavigationMenuLink
              onClick={() => onNavigate('/admin')}
              className={cn(
                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
                location.pathname === '/admin' ? "font-bold" : ""
              )}
            >
              Admin
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationLinks;
