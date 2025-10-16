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
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Welcome back, {currentUser.name}</p>
      </div>

      {/* Financial Summary */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Fund Balance</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-primary">₹{totalBalance.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground mt-1">Available for disbursement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Collected</CardTitle>
            <TrendingUp className="h-4 w-4 text-success shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-success">₹{totalCollected.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground mt-1">All time collections</p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Disbursed</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-destructive">₹{totalDisbursed.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground mt-1">Approved fund requests</p>
          </CardContent>
        </Card>
      </div>

      {/* My Status Card */}
      {currentUser.role !== 'admin' && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">My Payment Status</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Current month contribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Assigned Amount</p>
                  <p className="text-2xl sm:text-3xl font-bold">₹{currentUser.assigned_monthly_amount.toLocaleString('en-IN')}</p>
                </div>
                {isPaidThisMonth ? (
                  <Badge className="bg-success text-success-foreground hover:bg-success/90 h-12 sm:h-16 px-4 sm:px-6 text-base sm:text-lg">
                    <CheckCircle2 className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                    Paid
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="h-12 sm:h-16 px-4 sm:px-6 text-base sm:text-lg">
                    <XCircle className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
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
          <CardTitle className="text-lg sm:text-xl">Member Statistics</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Marital status distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4 p-3 sm:p-4 rounded-lg bg-muted/50">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Married</p>
                <p className="text-xl sm:text-2xl font-bold">{married}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 p-3 sm:p-4 rounded-lg bg-muted/50">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Unmarried</p>
                <p className="text-xl sm:text-2xl font-bold">{unmarried}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
