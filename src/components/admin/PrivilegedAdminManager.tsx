import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Trash2, Plus, Mail } from 'lucide-react';

interface PrivilegedAdmin {
  id: string;
  email: string;
  user_id: string;
  created_at: string;
}

export default function PrivilegedAdminManager() {
  const [admins, setAdmins] = useState<PrivilegedAdmin[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('privileged_admins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmins(data || []);
    } catch (error) {
      console.error('Error fetching privileged admins:', error);
      toast.error('Failed to load privileged admins');
    } finally {
      setLoading(false);
    }
  };

  const addAdmin = async () => {
    if (!newEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setSubmitting(true);
    try {
      // Find user by email first (check auth.users via profiles)
      const email = newEmail.toLowerCase().trim();
      
      // For now, we'll use a simpler approach - just try to insert with a placeholder user_id
      // The database will need to be updated to handle this better
      const { data, error } = await supabase
        .from('privileged_admins')
        .insert([{ 
          email: email,
          user_id: crypto.randomUUID() // Temporary - this should be handled by a database function
        }])
        .select();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('This email is already a privileged admin');
        } else {
          throw error;
        }
        return;
      }

      toast.success('Privileged admin added successfully');
      setNewEmail('');
      fetchAdmins();
    } catch (error: any) {
      console.error('Error adding privileged admin:', error);
      toast.error(error.message || 'Failed to add privileged admin');
    } finally {
      setSubmitting(false);
    }
  };

  const removeAdmin = async (adminId: string, email: string) => {
    if (!confirm(`Remove ${email} from privileged admins?`)) return;

    try {
      const { error } = await supabase
        .from('privileged_admins')
        .delete()
        .eq('id', adminId);

      if (error) throw error;

      toast.success('Privileged admin removed successfully');
      fetchAdmins();
    } catch (error: any) {
      console.error('Error removing privileged admin:', error);
      toast.error(error.message || 'Failed to remove privileged admin');
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Privileged Admin Management
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage emails authorized for admin access. Only privileged admins can modify this list.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new admin */}
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter email address"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addAdmin()}
          />
          <Button 
            onClick={addAdmin} 
            disabled={submitting}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Admin
          </Button>
        </div>

        {/* Admin list */}
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : admins.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No privileged admins found
          </div>
        ) : (
          <div className="space-y-2">
            {admins.map((admin) => (
              <div 
                key={admin.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{admin.email}</span>
                  <span className="text-sm text-muted-foreground">
                    Added: {new Date(admin.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Privileged Admin</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeAdmin(admin.id, admin.email)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-4 p-2 bg-muted/50 rounded">
          <strong>Note:</strong> Changes take effect immediately. Removing an admin will block their future logins.
          Emergency fallback emails are still available if database queries fail.
        </div>
      </CardContent>
    </Card>
  );
}