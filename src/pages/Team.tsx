import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTeamStructure, getUserTotalContributed, hasUserPaidThisMonth, mockUsers, getTotalCollected, getTotalSpent } from '@/lib/mockData';
import { User, CheckCircle, XCircle, Award, Users, Wallet, TrendingUp, Calendar, Plus, MessageSquare, CreditCard, DollarSign } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Team = () => {
  const { currentUser, isLoading } = useAuth();
  const [showFundRequestModal, setShowFundRequestModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!currentUser) return null;

  // Calculate fund statistics
  const totalUsers = mockUsers.filter(u => u.role !== 'admin').length;
  const totalMarriageAmount = totalUsers * 120000; // ₹120,000 per user for their marriage
  const totalPaidAmount = getTotalCollected();
  const spendAmount = getTotalSpent(); // Total amount disbursed to approved requests (3 × ₹120,000 = ₹360,000)
  const balanceAmount = totalPaidAmount - spendAmount; // Balance = Total Paid - Spend Amount
  const toCollectAmount = totalMarriageAmount - totalPaidAmount; // Amount still to be collected

  // Get team structure with responsible members and their team members
  const teams = getTeamStructure();

  // Check if user can request funds or deposit to wallet
  const canRequestFunds = currentUser.role === 'member' || currentUser.role === 'responsible_member';
  const canDepositWallet = currentUser.role === 'member' || currentUser.role === 'responsible_member';

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Marriage Fund Overview</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Track contributions and fund status</p>
        </div>
        <div className="flex gap-2">
          {canRequestFunds && (
            <Button 
              onClick={() => setShowFundRequestModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Request Fund
            </Button>
          )}
          {canDepositWallet && (
            <Button 
              onClick={() => setShowWalletModal(true)}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Deposit Wallet
            </Button>
          )}
        </div>
      </div>

      {/* Fund Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-blue-500 text-white flex-shrink-0">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">Total Members</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 dark:text-blue-100">{totalUsers}</p>
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
                <p className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">Total Marriage Fund</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900 dark:text-green-100">₹{totalMarriageAmount.toLocaleString('en-IN')}</p>
                <p className="text-xs text-green-500 dark:text-green-400">₹120,000 per user</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border-purple-200 dark:border-purple-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-purple-500 text-white flex-shrink-0">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400">Total Paid</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900 dark:text-purple-100">₹{totalPaidAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border-red-200 dark:border-red-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-red-500 text-white flex-shrink-0">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-red-600 dark:text-red-400">Spend Amount</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-900 dark:text-red-100">₹{spendAmount.toLocaleString('en-IN')}</p>
                <p className="text-xs text-red-500 dark:text-red-400">Approved requests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-cyan-200 dark:border-cyan-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-cyan-500 text-white flex-shrink-0">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-cyan-600 dark:text-cyan-400">Balance Amount</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-900 dark:text-cyan-100">₹{balanceAmount.toLocaleString('en-IN')}</p>
                <p className="text-xs text-cyan-500 dark:text-cyan-400">Available funds</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-orange-200 dark:border-orange-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-orange-500 text-white flex-shrink-0">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-orange-600 dark:text-orange-400">To Collect</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-900 dark:text-orange-100">₹{toCollectAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fund Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Fund Collection Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
      <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Collection Progress</span>
              <span className="font-medium">
                ₹{totalPaidAmount.toLocaleString('en-IN')} / ₹{totalMarriageAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <Progress value={(totalPaidAmount / totalMarriageAmount) * 100} className="h-3" />
            <div className="text-center text-sm text-muted-foreground">
              {((totalPaidAmount / totalMarriageAmount) * 100).toFixed(1)}% Collected
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Balance Amount</span>
                <span className="font-medium">
                  ₹{balanceAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                (Total Paid: ₹{totalPaidAmount.toLocaleString('en-IN')} - Spent: ₹{spendAmount.toLocaleString('en-IN')})
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leader-Based Members */}
      <div className="space-y-6">
        {teams.map((team) => {
          const leaderTotalPaid = getUserTotalContributed(team.responsible_member.id);
          const leaderMarriageAmount = 120000;
          const leaderToCollect = leaderMarriageAmount - leaderTotalPaid;
          const leaderPaidThisMonth = hasUserPaidThisMonth(team.responsible_member.id);

          return (
            <Card key={team.responsible_member.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{team.responsible_member.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Responsible Member - {team.responsible_member.marital_status}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">₹{leaderTotalPaid.toLocaleString('en-IN')}</span>
                      {leaderPaidThisMonth ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Paid
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          <XCircle className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Target: ₹{leaderMarriageAmount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      To Collect: ₹{leaderToCollect.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 ml-6 border-l-2 border-border pl-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    Team Members ({team.members.length})
                  </h4>
                  {team.members.map((member) => {
                    const memberTotalPaid = getUserTotalContributed(member.id);
                    const memberMarriageAmount = 120000;
                    const memberToCollect = memberMarriageAmount - memberTotalPaid;
                    const memberPaidThisMonth = hasUserPaidThisMonth(member.id);

                    return (
                      <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.marital_status}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">₹{memberTotalPaid.toLocaleString('en-IN')}</span>
                            {memberPaidThisMonth ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                                <CheckCircle className="mr-1 h-2.5 w-2.5" />
                                Paid
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="text-xs">
                                <XCircle className="mr-1 h-2.5 w-2.5" />
                                Pending
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Target: ₹{memberMarriageAmount.toLocaleString('en-IN')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            To Collect: ₹{memberToCollect.toLocaleString('en-IN')}
                          </p>
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

      {/* Fund Request Modal Placeholder */}
      {showFundRequestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Request Fund</h3>
            <p className="text-muted-foreground mb-4">Fund request functionality will be implemented here.</p>
            <Button onClick={() => setShowFundRequestModal(false)} className="w-full">
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Wallet Deposit Modal Placeholder */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Deposit to Wallet</h3>
            <p className="text-muted-foreground mb-4">Wallet deposit functionality will be implemented here.</p>
            <Button onClick={() => setShowWalletModal(false)} className="w-full">
              Close
            </Button>
          </div>
      </div>
      )}
    </div>
  );
};

export default Team;
