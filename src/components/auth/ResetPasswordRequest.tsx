import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ResetPasswordRequest() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const { error } = await resetPassword(email);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    
    setLoading(false);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-foreground">
              <Mail className="h-8 w-8 mx-auto mb-2 text-green-600" />
              Email Sent!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Password reset email sent to <strong>{email}</strong>. Please check your inbox.
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">
              Check your email and click the reset link to set a new password.
            </p>
            <Button 
              onClick={handleBackToHome}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-foreground">
            Reset Password
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Enter your email to receive a password reset link
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>
            
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Sending Reset Email...' : 'Send Reset Email'}
            </Button>
            
            <Button 
              type="button"
              onClick={handleBackToHome}
              variant="outline"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}