import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { adminClient } from "@/integrations/supabase/clients";

const EmergencyAdminTools = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePromoteUser = async () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await adminClient.rpc('emergency_promote_admin', {
        user_email: email.trim()
      });

      if (error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.success(data || "User promoted to admin successfully!");
        setEmail("");
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyReset = async () => {
    const confirmed = window.confirm(
      "⚠️ EMERGENCY RESET ⚠️\n\n" +
      "This will temporarily disable Row Level Security to allow recovery access.\n" +
      "Only use this if you are completely locked out!\n\n" +
      "You will need to manually re-enable RLS after recovery.\n\n" +
      "Continue?"
    );

    if (!confirmed) return;

    setIsLoading(true);
    try {
      const { data, error } = await adminClient.rpc('emergency_admin_reset');

      if (error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.success("Emergency reset activated! RLS temporarily disabled.");
        toast.warning("Remember to re-enable RLS after recovery!", {
          duration: 10000
        });
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Emergency Admin Tools
        </CardTitle>
        <p className="text-sm text-red-600">
          Use these tools only in emergency situations when normal admin access fails.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-red-800 flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Promote User to Admin
          </h4>
          <p className="text-sm text-red-600">
            Enter the email of a registered user to promote them to admin status.
          </p>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handlePromoteUser}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? "Promoting..." : "Promote"}
            </Button>
          </div>
        </div>

        <div className="border-t border-red-200 pt-4">
          <h4 className="font-semibold text-red-800 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Emergency RLS Reset
          </h4>
          <p className="text-sm text-red-600 mb-4">
            <strong>⚠️ DANGER:</strong> This temporarily disables Row Level Security.
            Only use if completely locked out!
          </p>
          <Button 
            onClick={handleEmergencyReset}
            disabled={isLoading}
            variant="destructive"
            className="w-full"
          >
            {isLoading ? "Resetting..." : "Emergency Reset (DANGER)"}
          </Button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h5 className="font-semibold text-yellow-800 mb-2">Recovery Instructions:</h5>
          <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Sign up for a new account using the Secure tab</li>
            <li>Use "Promote User to Admin" to promote your new account</li>
            <li>Log in with your new secure admin account</li>
            <li>Phase out the legacy system once secure access is confirmed</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyAdminTools;