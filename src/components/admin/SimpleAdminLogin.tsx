import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useSimpleAdminAuth } from "./SimpleAdminAuth";

const SimpleAdminLogin = () => {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useSimpleAdminAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { success, error } = await login(token);
    if (success) {
      toast.success("Successfully logged in!");
    } else {
      toast.error(error || "Invalid access token");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-black text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2" />
            Buddy's Admin Login
          </CardTitle>
          <p className="text-sm text-gray-600 text-center">
            Enter admin access token to continue
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Admin Access Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                className="text-lg py-3"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full cozy-button text-lg py-3"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleAdminLogin;