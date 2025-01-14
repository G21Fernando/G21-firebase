import { Card } from "@/components/ui/card";
import ChordsManager from "@/components/admin/ChordsManager";
import BackingTracksManager from "@/components/admin/BackingTracksManager";
import StrummingPatternsManager from "@/components/admin/StrummingPatternsManager";

const Admin = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChordsManager />
        <BackingTracksManager />
        <StrummingPatternsManager />
      </div>
    </div>
  );
};

export default Admin;