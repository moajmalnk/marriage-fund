import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Shield, Heart } from 'lucide-react';

const Profile = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">View your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Full Name</span>
              </div>
              <p className="text-lg font-medium">{currentUser.name}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Username</span>
              </div>
              <p className="text-lg font-medium">{currentUser.username}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Role</span>
              </div>
              <Badge variant="outline" className="capitalize">
                {currentUser.role.replace('_', ' ')}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="h-4 w-4" />
                <span>Marital Status</span>
              </div>
              <Badge 
                variant="outline"
                className={currentUser.marital_status === 'Married' ? 'bg-success/10 text-success border-success' : ''}
              >
                {currentUser.marital_status}
              </Badge>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Assigned Monthly Amount</p>
              <p className="text-3xl font-bold text-primary">
                ₹{currentUser.assigned_monthly_amount.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
