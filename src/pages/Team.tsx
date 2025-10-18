import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTeamStructure, getUserTotalContributed, hasUserPaidThisMonth, mockUsers, mockPayments } from '@/lib/mockData';
import { User, CheckCircle, XCircle, Award, Users, DollarSign, TrendingUp, Calculator } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const Team = () => {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) return null;

  const teams = getTeamStructure();
  
  // Calculate comprehensive fund statistics
  const totalUsers = mockUsers.filter(u => u.role !== 'admin').length;
  const totalMarriageAmount = totalUsers * 5000; // ₹5000 per user
  const totalPaidAmount = mockPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = totalMarriageAmount - totalPaidAmount;
  
  // Get marital status counts
  const marriedCount = mockUsers.filter(u => u.marital_status === 'Married' && u.role !== 'admin').length;
  const unmarriedCount = mockUsers.filter(u => u.marital_status === 'Unmarried' && u.role !== 'admin').length;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Team Structure</h1>
        <p className="text-sm sm:text-base text-muted-foreground">View team hierarchy and payment progress</p>
      </div>

      {/* Fund Statistics Overview */}
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500 text-white">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Members</p>
                <p className="text-lg sm:text-xl font-bold text-blue-700 dark:text-blue-300">
                  {totalUsers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-green-500 text-white">
                <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Marriage Amount</p>
                <p className="text-lg sm:text-xl font-bold text-green-700 dark:text-green-300">
                  ₹{totalMarriageAmount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/30 dark:to-violet-950/30 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500 text-white">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Paid Amount</p>
                <p className="text-lg sm:text-xl font-bold text-purple-700 dark:text-purple-300">
                  ₹{totalPaidAmount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950/30 dark:to-red-950/30 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500 text-white">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Pending Amount</p>
                <p className="text-lg sm:text-xl font-bold text-orange-700 dark:text-orange-300">
                  ₹{pendingAmount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Marital Status Overview */}
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Married Members</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{marriedCount}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unmarried Members</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{unmarriedCount}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {teams.map((team) => {
          const leaderContributed = getUserTotalContributed(team.responsible_member.id);
          const leaderExpected = 5000; // Total marriage amount per user
          const leaderProgress = Math.min((leaderContributed / leaderExpected) * 100, 100);
          const leaderCompleted = leaderProgress >= 100;
          const leaderPaidThisMonth = hasUserPaidThisMonth(team.responsible_member.id);
          const leaderPendingAmount = leaderExpected - leaderContributed;

          return (
            <Card key={team.responsible_member.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <span className="truncate">{team.responsible_member.name}</span>
                        {leaderCompleted && (
                          <Award className="h-4 w-4 sm:h-5 sm:w-5 text-primary fill-primary shrink-0" />
                        )}
                      </CardTitle>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Responsible Member - {team.responsible_member.marital_status}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto space-y-2">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Monthly Amount</p>
                      <p className="text-base sm:text-lg font-bold">
                        ₹{team.responsible_member.assigned_monthly_amount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Total Paid</p>
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                        ₹{leaderContributed.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Pending</p>
                      <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                        ₹{leaderPendingAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    {leaderPaidThisMonth ? (
                      <Badge className="bg-success text-success-foreground hover:bg-success/90 mt-1 text-xs">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Paid This Month
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="mt-1 text-xs">
                        <XCircle className="mr-1 h-3 w-3" />
                        Pending This Month
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm mb-2 gap-1">
                    <span className="text-muted-foreground">Marriage Fund Progress (₹5,000 Target)</span>
                    <span className="font-medium">
                      ₹{leaderContributed.toLocaleString('en-IN')} / ₹{leaderExpected.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <Progress value={leaderProgress} className="h-2" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 ml-3 sm:ml-6 border-l-2 border-border pl-3 sm:pl-6">
                  {team.members.map((member) => {
                    const memberContributed = getUserTotalContributed(member.id);
                    const memberExpected = 5000; // Total marriage amount per user
                    const memberProgress = Math.min((memberContributed / memberExpected) * 100, 100);
                    const memberCompleted = memberProgress >= 100;
                    const memberPaidThisMonth = hasUserPaidThisMonth(member.id);
                    const memberPendingAmount = memberExpected - memberContributed;

                    return (
                      <div key={member.id} className="bg-muted/30 rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center shrink-0">
                              <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium flex items-center gap-2 text-sm">
                                <span className="truncate">{member.name}</span>
                                {memberCompleted && (
                                  <Award className="h-4 w-4 text-primary fill-primary shrink-0" />
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">{member.marital_status}</p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right space-y-1">
                            <div>
                              <p className="text-xs text-muted-foreground">Monthly</p>
                              <p className="text-xs sm:text-sm font-medium">
                                ₹{member.assigned_monthly_amount.toLocaleString('en-IN')}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Total Paid</p>
                              <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                                ₹{memberContributed.toLocaleString('en-IN')}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Pending</p>
                              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                                ₹{memberPendingAmount.toLocaleString('en-IN')}
                              </p>
                            </div>
                            {memberPaidThisMonth ? (
                              <Badge className="bg-success text-success-foreground hover:bg-success/90 mt-1 text-xs">
                                <CheckCircle className="mr-1 h-2.5 w-2.5" />
                                Paid
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="mt-1 text-xs">
                                <XCircle className="mr-1 h-2.5 w-2.5" />
                                Pending
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs mb-1 gap-1">
                            <span className="text-muted-foreground">Marriage Fund Progress (₹5,000 Target)</span>
                            <span className="font-medium">
                              ₹{memberContributed.toLocaleString('en-IN')} / ₹{memberExpected.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <Progress value={memberProgress} className="h-1.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Team;
