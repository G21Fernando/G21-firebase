import { Link, useLocation } from "react-router-dom";
import { Home, Zap, BarChart2, Users, Settings } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useAdmin } from "@/hooks/useAdmin";

const MobileFooter = () => {
  const location = useLocation();
  const session = useSession();
  const { isAdmin } = useAdmin();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 md:hidden">
      <div className="flex justify-around items-center">
        <Link
          to="/"
          className={`flex flex-col items-center ${
            location.pathname === "/" ? "text-[#11245A]" : "text-gray-500"
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </Link>
        
        <Link
          to="/challenge"
          className={`flex flex-col items-center ${
            location.pathname === "/challenge" ? "text-[#11245A]" : "text-gray-500"
          }`}
        >
          <Zap className="w-6 h-6" />
          <span className="text-xs">Challenge</span>
        </Link>

        <Link
          to="/stats"
          className={`flex flex-col items-center ${
            location.pathname === "/stats" ? "text-[#11245A]" : "text-gray-500"
          }`}
        >
          <BarChart2 className="w-6 h-6" />
          <span className="text-xs">Stats</span>
        </Link>

        <Link
          to="/feed"
          className={`flex flex-col items-center ${
            location.pathname === "/feed" ? "text-[#11245A]" : "text-gray-500"
          }`}
        >
          <Users className="w-6 h-6" />
          <span className="text-xs">Feed</span>
        </Link>

        {isAdmin && (
          <Link
            to="/admin"
            className={`flex flex-col items-center ${
              location.pathname === "/admin" ? "text-[#11245A]" : "text-gray-500"
            }`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs">Admin</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileFooter;