import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getTotalFundBalance, getTotalCollected, getTotalDisbursed, getMaritalStatusCount, hasUserPaidThisMonth } from '@/lib/mockData';
import { 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Heart,
  Shield,
  Calendar,
  Activity,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { currentUser, isLoading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) return null;

  const totalBalance = getTotalFundBalance();
  const totalCollected = getTotalCollected();
  const totalDisbursed = getTotalDisbursed();
  const { married, unmarried } = getMaritalStatusCount();
  const isPaidThisMonth = hasUserPaidThisMonth(currentUser.id);

  const quickActions = [
    { label: "Make Payment", icon: IndianRupee, href: "/payments", variant: "default" as const },
    { label: "View Team", icon: Users, href: "/team", variant: "outline" as const },
    { label: "Fund Requests", icon: Heart, href: "/fund-requests", variant: "outline" as const },
  ];

  const recentActivity = [
    { action: "Payment received", amount: "₹2,500", user: "Priya Sharma", time: "2 hours ago" },
    { action: "Fund disbursed", amount: "₹50,000", user: "Rajesh Kumar", time: "1 day ago" },
    { action: "New member joined", amount: "", user: "Anita Singh", time: "3 days ago" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className={cn(
          "space-y-2 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Welcome back, <span className="font-semibold text-slate-900 dark:text-slate-100">{currentUser.name}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={cn(
          "transition-all duration-700 delay-100",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks and navigation shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant}
                    className="h-16 justify-start group hover:scale-105 transition-all duration-200"
                    asChild
                  >
                    <a href={action.href}>
                      <action.icon className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                      {action.label}
                      <ArrowUpRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Overview */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className={cn(
            "lg:col-span-2 border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-lg transition-all duration-700 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Financial Overview
              </CardTitle>
              <CardDescription>Current fund status and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Balance</p>
                    <IndianRupee className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">₹{totalBalance.toLocaleString('en-IN')}</div>
                  <p className="text-xs text-slate-500">Available for disbursement</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Collected</p>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">₹{totalCollected.toLocaleString('en-IN')}</div>
                  <p className="text-xs text-slate-500">All time collections</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Disbursed</p>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="text-2xl font-bold text-red-600">₹{totalDisbursed.toLocaleString('en-IN')}</div>
                  <p className="text-xs text-slate-500">Approved requests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Member Statistics */}
          <Card className={cn(
            "border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-lg transition-all duration-700 delay-300",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Community Stats
              </CardTitle>
              <CardDescription>Member distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                    <Heart className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Married</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{married}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Unmarried</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{unmarried}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Status Card */}
        {currentUser.role !== 'admin' && (
          <Card className={cn(
            "border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 backdrop-blur-sm shadow-lg transition-all duration-700 delay-400",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                My Payment Status
              </CardTitle>
              <CardDescription>Current month contribution status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Assigned Amount</p>
                  <p className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
                    ₹{currentUser.assigned_monthly_amount.toLocaleString('en-IN')}
                  </p>
                </div>
                {isPaidThisMonth ? (
                  <Badge className="bg-green-500 text-white hover:bg-green-600 h-16 px-6 text-lg shadow-lg">
                    <CheckCircle2 className="mr-2 h-6 w-6" />
                    Paid This Month
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="h-16 px-6 text-lg shadow-lg">
                    <XCircle className="mr-2 h-6 w-6" />
                    Payment Pending
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card className={cn(
          "border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-lg transition-all duration-700 delay-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates from the community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-600">
                      <Activity className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{activity.action}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">by {activity.user}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.amount && (
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{activity.amount}</p>
                    )}
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
