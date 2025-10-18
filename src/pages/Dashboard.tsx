import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getTotalFundBalance, getTotalCollected, getTotalDisbursed, getMaritalStatusCount, mockPayments, mockFundRequests, mockUsers } from '@/lib/mockData';
import { 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Heart,
  Activity,
  ArrowUpRight,
  Sparkles,
  Wallet,
  CreditCard,
  UserPlus,
  DollarSign
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

  // Calculate counts for quick actions
  const totalPayments = mockPayments.length;
  const totalTeamMembers = mockUsers.filter(user => user.role !== 'admin').length;
  const totalFundRequests = mockFundRequests.length;
  const pendingFundRequests = mockFundRequests.filter(request => request.status === 'pending').length;

  const quickActions = [
    { 
      label: "Make Payment", 
      icon: IndianRupee, 
      href: "/payments", 
      variant: "default" as const,
      count: totalPayments,
      subtitle: "Total payments"
    },
    { 
      label: "View Team", 
      icon: Users, 
      href: "/team", 
      variant: "outline" as const,
      count: totalTeamMembers,
      subtitle: "Team members"
    },
    { 
      label: "Fund Requests", 
      icon: Heart, 
      href: "/fund-requests", 
      variant: "outline" as const,
      count: totalFundRequests,
      subtitle: `${pendingFundRequests} pending`
    },
  ];

  const recentActivity = [
    { 
      action: "Payment received", 
      amount: "₹2,500", 
      user: "Priya Sharma", 
      time: "2 hours ago",
      icon: CreditCard,
      type: "payment"
    },
    { 
      action: "Fund disbursed", 
      amount: "₹50,000", 
      user: "Rajesh Kumar", 
      time: "1 day ago",
      icon: DollarSign,
      type: "disbursement"
    },
    { 
      action: "New member joined", 
      amount: "", 
      user: "Anita Singh", 
      time: "3 days ago",
      icon: UserPlus,
      type: "member"
    },
    { 
      action: "Fund request approved", 
      amount: "₹120,000", 
      user: "Mohammed Ali", 
      time: "5 days ago",
      icon: Heart,
      type: "approval"
    },
    { 
      action: "Payment received", 
      amount: "₹5,000", 
      user: "Suresh Kumar", 
      time: "1 week ago",
      icon: CreditCard,
      type: "payment"
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Welcome back, <span className="font-semibold text-slate-900 dark:text-slate-100">{currentUser.name}</span>
          </p>
        </div>
      </div>

      {/* Dashboard Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-blue-500 text-white flex-shrink-0">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">Total Balance</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 dark:text-blue-100">₹{totalBalance.toLocaleString('en-IN')}</p>
                <p className="text-xs text-blue-500 dark:text-blue-400">Available funds</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-green-500 text-white flex-shrink-0">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">Total Collected</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900 dark:text-green-100">₹{totalCollected.toLocaleString('en-IN')}</p>
                <p className="text-xs text-green-500 dark:text-green-400">All time collections</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border-red-200 dark:border-red-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-red-500 text-white flex-shrink-0">
                <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-red-600 dark:text-red-400">Total Disbursed</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-900 dark:text-red-100">₹{totalDisbursed.toLocaleString('en-IN')}</p>
                <p className="text-xs text-red-500 dark:text-red-400">Approved requests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border-purple-200 dark:border-purple-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-purple-500 text-white flex-shrink-0">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400">Married Members</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900 dark:text-purple-100">{married}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-cyan-200 dark:border-cyan-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-cyan-500 text-white flex-shrink-0">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-cyan-600 dark:text-cyan-400">Unmarried Members</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-900 dark:text-cyan-100">{unmarried}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-orange-950/30 border-orange-200 dark:border-orange-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-orange-500 text-white flex-shrink-0">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-orange-600 dark:text-orange-400">Total Members</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-900 dark:text-orange-100">{married + unmarried}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <div className="p-2 rounded-lg bg-slate-500 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            Quick Actions
          </CardTitle>
          <CardDescription className="text-slate-700 dark:text-slate-300">
            Common tasks and navigation shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <div key={index} className="group">
                <Button
                  variant={action.variant}
                  className="h-20 w-full justify-start p-4 group hover:scale-105 transition-all duration-200"
                  asChild
                >
                  <a href={action.href}>
                    <div className="flex items-center gap-3 w-full">
                      <action.icon className="h-5 w-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{action.label}</div>
                        <div className="text-xs opacity-70">{action.subtitle}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{action.count}</div>
                        <ArrowUpRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


      {/* Recent Activity */}
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <div className="p-2 rounded-lg bg-slate-500 text-white">
              <Activity className="h-5 w-5" />
            </div>
            Recent Activity
          </CardTitle>
          <CardDescription className="text-slate-700 dark:text-slate-300">
            Latest updates from the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => {
              const IconComponent = activity.icon;
              const getIconColor = (type: string) => {
                switch (type) {
                  case 'payment': return 'text-green-600 dark:text-green-400';
                  case 'disbursement': return 'text-blue-600 dark:text-blue-400';
                  case 'member': return 'text-purple-600 dark:text-purple-400';
                  case 'approval': return 'text-orange-600 dark:text-orange-400';
                  default: return 'text-slate-600 dark:text-slate-300';
                }
              };
              
              const getBgColor = (type: string) => {
                switch (type) {
                  case 'payment': return 'bg-green-50 dark:bg-green-950/30';
                  case 'disbursement': return 'bg-blue-50 dark:bg-blue-950/30';
                  case 'member': return 'bg-purple-50 dark:bg-purple-950/30';
                  case 'approval': return 'bg-orange-50 dark:bg-orange-950/30';
                  default: return 'bg-slate-50 dark:bg-slate-700/50';
                }
              };

              return (
                <div 
                  key={index} 
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:shadow-md",
                    getBgColor(activity.type)
                  )}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm">
                      <IconComponent className={cn("h-4 w-4", getIconColor(activity.type))} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                        {activity.action}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">
                        by {activity.user}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right ml-4">
                    {activity.amount && (
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                        {activity.amount}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* View All Activities Button */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-600">
            <Button 
              variant="outline" 
              className="w-full h-10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
            >
              <Activity className="h-4 w-4 mr-2" />
              View All Activities
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
