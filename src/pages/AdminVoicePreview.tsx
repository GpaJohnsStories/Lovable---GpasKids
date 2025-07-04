
import AdminLayout from "@/components/admin/AdminLayout";
import VoicePreview from "@/components/VoicePreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AdminVoicePreviewPage = () => {
  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <Link to="/buddys_admin">
          <Button className="cozy-button">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Dashboard
          </Button>
        </Link>
        <div className="bg-red-100 border border-red-300 rounded-lg px-4 py-2">
          <span className="text-red-800 font-bold text-sm">ADMIN ONLY - Voice Testing</span>
        </div>
      </div>
      
      <VoicePreview />
    </AdminLayout>
  );
};

export default AdminVoicePreviewPage;
