import { Link, useLocation } from "react-router-dom";
import { Timer, Zap, MessageSquare } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";

const MobileFooter = () => {
  const location = useLocation();
  const session = useSession();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 md:hidden">
      <div className="container mx-auto max-w-lg">
        <div className="flex justify-around items-center">
          <Link
            to="/"
            className={`flex flex-col items-center ${
              location.pathname === "/" ? "text-[#11245A]" : "text-gray-500"
            }`}
          >
            <Timer className="w-6 h-6" />
            <span className="text-xs mt-1">Timekeeper</span>
          </Link>
          
          <Link
            to="/sprinter"
            className={`flex flex-col items-center ${
              location.pathname === "/sprinter" ? "text-[#11245A]" : "text-gray-500"
            }`}
          >
            <Zap className="w-6 h-6" />
            <span className="text-xs mt-1">Sprinter</span>
          </Link>

          <Link
            to="/tutor"
            className={`flex flex-col items-center ${
              location.pathname === "/tutor" ? "text-[#11245A]" : "text-gray-500"
            }`}
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-xs mt-1">Chat</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileFooter;