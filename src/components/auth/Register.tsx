import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';

export default function Register() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Password strength states
  const [passwordStrength, setPasswordStrength] = useState({
    isValid: false,
    strengthScore: 0,
    errors: [] as string[]
  });
  const [checkingPassword, setCheckingPassword] = useState(false);

  const checkPasswordStrength = async (password: string) => {
    if (!password) {
      setPasswordStrength({ isValid: false, strengthScore: 0, errors: [] });
      return;
    }
    
    setCheckingPassword(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('check-password-strength', {
        body: { password }
      });
      
      if (error) {
        console.error('Password strength check failed:', error);
        setPasswordStrength({ isValid: false, strengthScore: 0, errors: ['Unable to check password strength'] });
      } else {
        setPasswordStrength({
          isValid: data.isValid,
          strengthScore: data.strengthScore,
          errors: data.errors || []
        });
      }
    } catch (err) {
      console.error('Password strength check error:', err);
      setPasswordStrength({ isValid: false, strengthScore: 0, errors: ['Unable to check password strength'] });
    }
    
    setCheckingPassword(false);
  };

  // Debounced password strength check using useEffect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (password) {
        checkPasswordStrength(password);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [password]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const getStrengthLevel = (score: number) => {
    if (score >= 80) return { level: 'Strong', color: 'bg-green-500' };
    if (score >= 60) return { level: 'Good', color: 'bg-yellow-500' };
    if (score >= 40) return { level: 'Fair', color: 'bg-orange-500' };
    return { level: 'Weak', color: 'bg-red-500' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      setLoading(false);
      return;
    }
    
    if (!passwordStrength.isValid && password.length > 0) {
      setError('Please use a stronger password that meets all requirements');
      setLoading(false);
      return;
    }
    
    const { data, error } = await signUp({ 
      email, 
      password,
      full_name: fullName
    });
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-foreground">
            Create Admin Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Registration successful! Please check your email for verification.
              </AlertDescription>
            </Alert>
          )}
          
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your admin email"
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter a strong password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  disabled={loading}
                />
                
                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Password Strength: {getStrengthLevel(passwordStrength.strengthScore).level}
                      </span>
                      {checkingPassword && <span className="text-xs">Checking...</span>}
                    </div>
                    
                    <Progress 
                      value={passwordStrength.strengthScore} 
                      className="h-2"
                    />
                    
                    {passwordStrength.errors.length > 0 && (
                      <div className="space-y-1">
                        {passwordStrength.errors.map((error, index) => (
                          <p key={index} className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {error}
                          </p>
                        ))}
                      </div>
                    )}
                    
                    {passwordStrength.isValid && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Password meets all requirements
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}