import WebAuthnManager from "./WebAuthnManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Admin Settings</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Manage security features and authentication methods for your admin account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WebAuthnManager />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;