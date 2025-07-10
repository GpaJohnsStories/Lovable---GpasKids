import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Mail, Lock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { adminClient } from "@/integrations/supabase/clients";

const AdminPasswordSync = () => {
  const [email, setEmail] = useState("gpajohn.buddy@gmail.com");
  const [adminPassword, setAdminPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordSync = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('🔧 Starting password synchronization:', { email });

    try {
      // Use our new secure admin function for password synchronization
      const { data: syncResult, error: syncError } = await adminClient
        .rpc('admin_sync_auth_password', {
          admin_email: email,
          admin_password: adminPassword,
          new_auth_password: adminPassword
        });

      console.log('🔧 Password sync response:', { 
        result: syncResult,
        error: syncError?.message 
      });

      if (syncError) {
        console.error('❌ Password sync error:', syncError);
        toast.error("Password sync failed: " + syncError.message);
        return;
      }

      // Type guard and validation for the response
      const result = syncResult as any;
      if (!result || result.success !== true) {
        console.error('❌ Password sync failed:', result?.error);
        toast.error("Password sync failed: " + (result?.error || 'Unknown error'));
        return;
      }

      console.log('✅ Password synchronization successful');
      toast.success("Password synchronized successfully! You can now log in normally.");
      
      // Redirect to login page after successful sync
      setTimeout(() => {
        window.location.href = '/buddys_admin';
      }, 2000);

    } catch (error: any) {
      console.error('💥 Password sync exception:', error);
      toast.error(`Password sync error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-black text-center">
            <Key className="h-8 w-8 mx-auto mb-2" />
            Admin Password Sync
          </CardTitle>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Password Synchronization Required</p>
                <p className="mt-1">Your admin password needs to be synchronized with Supabase Auth.</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSync} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-lg py-3 pl-10"
                readOnly
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="password"
                placeholder="Admin Password (SecureAdmin2025!)"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                className="text-lg py-3 pl-10"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full cozy-button text-lg py-3"
              disabled={isLoading}
            >
              {isLoading ? "Synchronizing..." : "Sync Password"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <div className="text-xs text-gray-500 mt-2 p-3 bg-gray-50 rounded">
              <strong>Note:</strong> This tool updates your Supabase Auth password to match your admin system password. 
              After synchronization, you can use the normal login process.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPasswordSync;