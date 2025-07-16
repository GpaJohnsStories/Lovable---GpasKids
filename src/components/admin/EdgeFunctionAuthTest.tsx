import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EdgeFunctionAuthTest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSignIn = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('secure-auth', {
        body: { email, password, action: 'signin' }
      });
      
      setResult({ data, error });
    } catch (err) {
      setResult({ error: err });
    }
    setLoading(false);
  };

  const testSignUp = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('secure-auth', {
        body: { email, password, action: 'signup' }
      });
      
      setResult({ data, error });
    } catch (err) {
      setResult({ error: err });
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Test Secure Auth Edge Function</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={testSignIn} disabled={loading}>
            Test Sign In
          </Button>
          <Button onClick={testSignUp} disabled={loading} variant="outline">
            Test Sign Up
          </Button>
        </div>
        {result && (
          <div className="mt-4 p-4 bg-muted rounded">
            <pre className="text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EdgeFunctionAuthTest;