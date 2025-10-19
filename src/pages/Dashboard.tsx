import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getTotalFundBalance, getTotalCollected, getTotalDisbursed, getMaritalStatusCount, mockPayments, mockFundRequests, mockUsers, getTeamStructure, getUserTotalContributed } from '@/lib/mockData';
import { 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Heart,
  ArrowUpRight,
  Sparkles,
  Wallet,
  Crown,
  Trophy,
  Medal,
  Award,
  Target,
  CheckCircle,
  Clock,
  XCircle,
  Calendar
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

  // Calculate team rankings
  const teamsWithRanking = getTeamStructure().map((team) => {
    const leaderTotalPaid = getUserTotalContributed(team.responsible_member.id);
    const teamMembersTotalPaid = team.members.reduce((sum, member) => sum + getUserTotalContributed(member.id), 0);
    const teamTotalPaid = leaderTotalPaid + teamMembersTotalPaid;
    const teamTotalTarget = (team.members.length + 1) * 120000;
    const teamTotalToCollect = teamTotalTarget - teamTotalPaid;
    const teamProgress = (teamTotalPaid / teamTotalTarget) * 100;

    return {
      ...team,
      leaderTotalPaid,
      teamMembersTotalPaid,
      teamTotalPaid,
      teamTotalTarget,
      teamTotalToCollect,
      teamProgress
    };
  }).sort((a, b) => b.teamTotalPaid - a.teamTotalPaid);

  // Get top 3 teams
  const topThreeTeams = teamsWithRanking.slice(0, 3);

  // Get recent fund requests (approved and pending)
  const recentFundRequests = mockFundRequests
    .filter(request => request.status === 'approved' || request.status === 'pending')
    .sort((a, b) => new Date(b.requested_date).getTime() - new Date(a.requested_date).getTime())
    .slice(0, 5); // Show latest 5 requests

  // Rank icon helper
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return { icon: Crown, color: 'text-yellow-600', bgColor: 'bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40', borderColor: 'border-yellow-400 dark:border-yellow-600' };
      case 2:
        return { icon: Trophy, color: 'text-gray-600', bgColor: 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/60 dark:to-gray-700/60', borderColor: 'border-gray-400 dark:border-gray-500' };
      case 3:
        return { icon: Medal, color: 'text-amber-700', bgColor: 'bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40', borderColor: 'border-amber-400 dark:border-amber-600' };
      default:
        return { icon: Award, color: 'text-blue-600', bgColor: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40', borderColor: 'border-blue-400 dark:border-blue-600' };
    }
  };

  // Fund request status helper
  const getFundRequestStatus = (request: any) => {
    if (request.status === 'approved') {
      if (request.payment_status === 'paid') {
        return { 
          icon: CheckCircle, 
          color: 'text-green-600 dark:text-green-400', 
          bgColor: 'bg-green-50 dark:bg-green-950/30',
          label: 'Paid',
          badgeColor: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700'
        };
      } else if (request.payment_status === 'partial') {
        return { 
          icon: Clock, 
          color: 'text-blue-600 dark:text-blue-400', 
          bgColor: 'bg-blue-50 dark:bg-blue-950/30',
          label: 'Partial',
          badgeColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700'
        };
      } else {
        return { 
          icon: Clock, 
          color: 'text-orange-600 dark:text-orange-400', 
          bgColor: 'bg-orange-50 dark:bg-orange-950/30',
          label: 'Pending Payment',
          badgeColor: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-700'
        };
      }
    } else if (request.status === 'pending') {
      return { 
        icon: Clock, 
        color: 'text-amber-600 dark:text-amber-400', 
        bgColor: 'bg-amber-50 dark:bg-amber-950/30',
        label: 'Under Review',
        badgeColor: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700'
      };
    }
    return { 
      icon: XCircle, 
      color: 'text-red-600 dark:text-red-400', 
      bgColor: 'bg-red-50 dark:bg-red-950/30',
      label: 'Declined',
      badgeColor: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700'
    };
  };

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
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
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

      {/* Top 3 Teams Ranking */}
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 text-white">
              <Trophy className="h-5 w-5" />
            </div>
            Top 3 Teams
          </CardTitle>
          <CardDescription className="text-slate-700 dark:text-slate-300">
            Leading teams by total contributions and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {topThreeTeams.map((team, index) => {
              const rank = index + 1;
              const rankInfo = getRankIcon(rank);
              const RankIcon = rankInfo.icon;
              
              return (
                <div key={team.responsible_member.id} className="relative group">
                  {/* Rank Badge */}
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className={`${rankInfo.bgColor} ${rankInfo.borderColor} border-2 rounded-full p-2 shadow-lg backdrop-blur-sm transform hover:scale-110 transition-transform duration-300`}>
                      <RankIcon className={`h-5 w-5 ${rankInfo.color}`} />
                    </div>
                  </div>
                  
                  <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-slate-800/10" />
                    
                    <CardContent className="relative p-6">
                      {/* Team Header */}
                      <div className="text-center mb-4">
                        <div className="flex items-center justify-center mb-3">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                            <Users className="h-6 w-6" />
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                          {team.responsible_member.name} Team
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {team.members.length + 1} members
                        </p>
                      </div>

                      {/* Rank Display */}
                      <div className="text-center mb-4">
                        <Badge variant="outline" className={`${rankInfo.color} ${rankInfo.borderColor} border-2 font-bold text-lg px-4 py-2 shadow-lg`}>
                          {rank === 1 ? '🥇 CHAMPION' : rank === 2 ? '🥈 RUNNER-UP' : '🥉 THIRD PLACE'}
                        </Badge>
                      </div>

                      {/* Team Stats */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 rounded-xl bg-white/50 dark:bg-slate-800/50">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Paid</span>
                          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{team.teamTotalPaid.toLocaleString('en-IN')}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 rounded-xl bg-white/50 dark:bg-slate-800/50">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Target</span>
                          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            ₹{team.teamTotalTarget.toLocaleString('en-IN')}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 rounded-xl bg-white/50 dark:bg-slate-800/50">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Progress</span>
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {team.teamProgress.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                          <span>Team Progress</span>
                          <span>{team.teamProgress.toFixed(1)}%</span>
                        </div>
                        <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${Math.min(team.teamProgress, 100)}%` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
          
          {/* View All Teams Button */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-600">
            <Button 
              variant="outline" 
              className="w-full h-10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
              asChild
            >
              <a href="/team">
                <Target className="h-4 w-4 mr-2" />
                View All Teams
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Fund Requests */}
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white">
              <Heart className="h-5 w-5" />
            </div>
            Recent Fund Requests
          </CardTitle>
          <CardDescription className="text-slate-700 dark:text-slate-300">
            Latest approved and pending fund requests from members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentFundRequests.map((request) => {
              const statusInfo = getFundRequestStatus(request);
              const StatusIcon = statusInfo.icon;

              return (
                <div 
                  key={request.id} 
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:shadow-md",
                    statusInfo.bgColor
                  )}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm">
                      <StatusIcon className={cn("h-5 w-5", statusInfo.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                          {request.user_name}
                      </p>
                        <Badge variant="outline" className={cn("text-xs px-2 py-1", statusInfo.badgeColor)}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">
                        {request.reason}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <Calendar className="h-3 w-3" />
                          <span>Requested: {new Date(request.requested_date).toLocaleDateString('en-IN')}</span>
                        </div>
                        {request.reviewed_date && (
                          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <CheckCircle className="h-3 w-3" />
                            <span>Reviewed: {new Date(request.reviewed_date).toLocaleDateString('en-IN')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right ml-4">
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-lg sm:text-xl">
                      ₹{request.amount.toLocaleString('en-IN')}
                    </p>
                    {request.paid_amount !== undefined && request.paid_amount > 0 && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Paid: ₹{request.paid_amount.toLocaleString('en-IN')}
                      </p>
                    )}
                    {request.payment_date && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Due: {new Date(request.payment_date).toLocaleDateString('en-IN')}
                    </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* View All Fund Requests Button */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-600">
            <Button 
              variant="outline" 
              className="w-full h-10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
              asChild
            >
              <a href="/fund-requests">
                <Heart className="h-4 w-4 mr-2" />
                View All Fund Requests
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default Dashboard;
