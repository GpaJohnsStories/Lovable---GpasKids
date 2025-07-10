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
      // First, verify the admin password is correct in our admin system
      const { data: loginResult, error: loginError } = await adminClient
        .rpc('admin_login', {
          email_input: email,
          password_input: adminPassword,
          device_info: 'password-sync-tool'
        });

      if (loginError || !loginResult || !(loginResult as any).success) {
        toast.error("Admin password verification failed. Please check your admin password.");
        return;
      }

      console.log('✅ Admin password verified, updating Supabase Auth password...');

      // Now update the Supabase Auth password to match
      const { error: updateError } = await adminClient.auth.updateUser({
        password: adminPassword
      });

      if (updateError) {
        console.error('❌ Failed to update Supabase Auth password:', updateError);
        toast.error("Failed to sync password: " + updateError.message);
        return;
      }

      console.log('✅ Password synchronization successful');
      toast.success("Password synchronization successful! You can now log in normally.");
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