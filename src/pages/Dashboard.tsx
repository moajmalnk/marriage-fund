import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getTotalFundBalance, getTotalCollected, getTotalDisbursed, getMaritalStatusCount, hasUserPaidThisMonth } from '@/lib/mockData';
import { IndianRupee, TrendingUp, TrendingDown, Users, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const { currentUser } = useAuth();
  
  if (!currentUser) return null;

  const totalBalance = getTotalFundBalance();
  const totalCollected = getTotalCollected();
  const totalDisbursed = getTotalDisbursed();
  const { married, unmarried } = getMaritalStatusCount();
  const isPaidThisMonth = hasUserPaidThisMonth(currentUser.id);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {currentUser.name}</p>
      </div>

      {/* Financial Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fund Balance</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₹{totalBalance.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground mt-1">Available for disbursement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">₹{totalCollected.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground mt-1">All time collections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">₹{totalDisbursed.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground mt-1">Approved fund requests</p>
          </CardContent>
        </Card>
      </div>

      {/* My Status Card */}
      {currentUser.role !== 'admin' && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>My Payment Status</CardTitle>
            <CardDescription>Current month contribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assigned Amount</p>
                  <p className="text-3xl font-bold">₹{currentUser.assigned_monthly_amount.toLocaleString('en-IN')}</p>
                </div>
                {isPaidThisMonth ? (
                  <Badge className="bg-success text-success-foreground hover:bg-success/90 h-16 px-6 text-lg">
                    <CheckCircle2 className="mr-2 h-6 w-6" />
                    Paid
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="h-16 px-6 text-lg">
                    <XCircle className="mr-2 h-6 w-6" />
                    Pending
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Marital Status Tally */}
      <Card>
        <CardHeader>
          <CardTitle>Member Statistics</CardTitle>
          <CardDescription>Marital status distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Married</p>
                <p className="text-2xl font-bold">{married}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unmarried</p>
                <p className="text-2xl font-bold">{unmarried}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
