import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Key, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { adminClient } from "@/integrations/supabase/clients";

const AdminPasswordChange = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('🔑 Starting password change process');

    try {
      // Validate passwords match
      if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }

      // Validate new password strength
      if (newPassword.length < 8) {
        toast.error("New password must be at least 8 characters long");
        return;
      }

      // First verify current password with admin_login
      const { data: loginResult, error: loginError } = await adminClient
        .rpc('admin_login', {
          email_input: 'gpajohn.buddy@gmail.com',
          password_input: currentPassword,
          device_info: 'password-change-tool'
        });

      if (loginError || !loginResult || !(loginResult as any).success) {
        toast.error("Current password is incorrect");
        return;
      }

      console.log('✅ Current password verified, updating to new password...');

      // Use the change_admin_password function to update the password
      const { data: changeResult, error: changeError } = await adminClient
        .rpc('change_admin_password', {
          admin_email: 'gpajohn.buddy@gmail.com',
          new_password: newPassword
        });

      if (changeError) {
        console.error('❌ Password change error:', changeError);
        toast.error("Failed to change password: " + changeError.message);
        return;
      }

      console.log('✅ Admin password updated in admin_users table');

      // Now sync the Supabase Auth password
      const { data: syncResult, error: syncError } = await adminClient
        .rpc('admin_sync_auth_password', {
          admin_email: 'gpajohn.buddy@gmail.com',
          admin_password: newPassword,
          new_auth_password: newPassword
        });

      if (syncError || !(syncResult as any)?.success) {
        console.warn('⚠️ Admin password changed but Supabase Auth sync failed');
        toast.warning("Password changed in admin system, but Supabase Auth sync failed. You may need to use the sync tool.");
        return;
      }

      console.log('✅ Password change complete - both systems updated');
      toast.success("Password changed successfully! Please note your new password.");
      
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
    } catch (error: any) {
      console.error('💥 Password change exception:', error);
      toast.error(`Password change error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-black text-center">
            <Key className="h-8 w-8 mx-auto mb-2" />
            Change Admin Password
          </CardTitle>
          <p className="text-sm text-gray-600 text-center">
            Update your secure admin password
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="text-lg py-3 pl-10 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="text-lg py-3 pl-10 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="text-lg py-3 pl-10 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            <Button 
              type="submit" 
              className="w-full cozy-button text-lg py-3"
              disabled={isLoading}
            >
              {isLoading ? "Changing Password..." : "Change Password"}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <div className="text-xs text-gray-500 mt-2 p-3 bg-gray-50 rounded">
              <strong>Security Note:</strong> Your new password will be updated in both the admin system and Supabase Auth. 
              Make sure to remember your new password as it will be required for future logins.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPasswordChange;