import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTeamStructure, getUserTotalContributed, hasUserPaidThisMonth, mockUsers, getTotalCollected, getTotalSpent } from '@/lib/mockData';
import { User, CheckCircle, XCircle, Award, Users, Wallet, TrendingUp, Calendar, Plus, MessageSquare, CreditCard, DollarSign, Heart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const Team = () => {
  const { currentUser, isLoading } = useAuth();
  const [showFundRequestModal, setShowFundRequestModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletFormData, setWalletFormData] = useState({
    amount: '',
    paymentMethod: 'bank_transfer',
    transactionId: '',
    notes: ''
  });
  const [isSubmittingWallet, setIsSubmittingWallet] = useState(false);
  const [fundRequestFormData, setFundRequestFormData] = useState({
    amount: '',
    reason: '',
    detailedReason: ''
  });
  const [isSubmittingFundRequest, setIsSubmittingFundRequest] = useState(false);
  
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

  // Wallet deposit handlers
  const handleWalletInputChange = (field: string, value: string) => {
    setWalletFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fund request handlers
  const handleFundRequestInputChange = (field: string, value: string) => {
    setFundRequestFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWalletSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingWallet(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Wallet deposit submitted:', {
        user: currentUser.name,
        amount: walletFormData.amount,
        paymentMethod: walletFormData.paymentMethod,
        transactionId: walletFormData.transactionId,
        notes: walletFormData.notes
      });

      // Reset form and close modal
      setWalletFormData({
        amount: '',
        paymentMethod: 'bank_transfer',
        transactionId: '',
        notes: ''
      });
      setShowWalletModal(false);
      
      console.log('Wallet deposit request submitted successfully!');
    } catch (error) {
      console.error('Error submitting wallet deposit:', error);
    } finally {
      setIsSubmittingWallet(false);
    }
  };

  const handleFundRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFundRequest(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Fund request submitted:', {
        user: currentUser.name,
        amount: fundRequestFormData.amount,
        reason: fundRequestFormData.reason,
        detailedReason: fundRequestFormData.detailedReason
      });

      // Reset form and close modal
      setFundRequestFormData({
        amount: '',
        reason: '',
        detailedReason: ''
      });
      setShowFundRequestModal(false);
      
      console.log('Fund request submitted successfully!');
    } catch (error) {
      console.error('Error submitting fund request:', error);
    } finally {
      setIsSubmittingFundRequest(false);
    }
  };


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
            <Dialog open={showFundRequestModal} onOpenChange={setShowFundRequestModal}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Request Fund
                </Button>
              </DialogTrigger>
            </Dialog>
          )}
          {canDepositWallet && (
            <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Deposit Wallet
                </Button>
              </DialogTrigger>
            </Dialog>
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
          
          // Calculate team totals
          const teamMembersTotalPaid = team.members.reduce((sum, member) => sum + getUserTotalContributed(member.id), 0);
          const teamTotalPaid = leaderTotalPaid + teamMembersTotalPaid;
          const teamTotalTarget = (team.members.length + 1) * 120000; // Leader + all members
          const teamTotalToCollect = teamTotalTarget - teamTotalPaid;

          return (
            <Card key={team.responsible_member.id}>
              <CardHeader>
                {/* Team Totals - First */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg p-4 mb-4 border border-blue-200 dark:border-blue-700">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Team Totals ({team.members.length + 1} members)
                  </h4>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Target</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        ₹{teamTotalTarget.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">To Collect</p>
                      <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        ₹{teamTotalToCollect.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Paid</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        ₹{teamTotalPaid.toLocaleString('en-IN')}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Progress</p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {((teamTotalPaid / teamTotalTarget) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  
                  {/* Team Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                      <span>Team Progress</span>
                      <span>{((teamTotalPaid / teamTotalTarget) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((teamTotalPaid / teamTotalTarget) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {/* Responsible Member Card - Second */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 text-lg">{team.responsible_member.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Responsible Member - {team.responsible_member.marital_status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">
                        ₹{leaderTotalPaid.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Paid</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Target</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        ₹{leaderMarriageAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">To Collect</p>
                      <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                        ₹{leaderToCollect.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Progress</p>
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {((leaderTotalPaid / leaderMarriageAmount) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{((leaderTotalPaid / leaderMarriageAmount) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((leaderTotalPaid / leaderMarriageAmount) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Individual Members ({team.members.length})
                  </h4>
                  <div className="grid gap-3">
                  {team.members.map((member) => {
                      const memberTotalPaid = getUserTotalContributed(member.id);
                      const memberMarriageAmount = 120000;
                      const memberToCollect = memberMarriageAmount - memberTotalPaid;
                      const memberProgress = (memberTotalPaid / memberMarriageAmount) * 100;

                    return (
                        <div key={member.id} className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-slate-100">{member.name}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{member.marital_status}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                ₹{memberTotalPaid.toLocaleString('en-IN')}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Paid</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Target</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                ₹{memberMarriageAmount.toLocaleString('en-IN')}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">To Collect</p>
                              <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                                ₹{memberToCollect.toLocaleString('en-IN')}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Progress</p>
                              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                {memberProgress.toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                              <span>Progress</span>
                              <span>{memberProgress.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(memberProgress, 100)}%` }}
                              ></div>
                        </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Fund Request Dialog */}
      <Dialog open={showFundRequestModal} onOpenChange={setShowFundRequestModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-500 text-white">
                <Heart className="h-5 w-5" />
              </div>
              Request Fund
            </DialogTitle>
            <DialogDescription>
              Submit a request for marriage fund assistance from the community.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fund-amount" className="text-sm font-medium">
                  Requested Amount (₹)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400">₹</span>
                  <Input
                    id="fund-amount"
                    type="number"
                    placeholder="Enter amount (max ₹120,000)"
                    value={fundRequestFormData.amount}
                    onChange={(e) => handleFundRequestInputChange('amount', e.target.value)}
                    className="h-12 pl-10 border-slate-300 focus:border-blue-500"
                    required
                    min="1"
                    max="120000"
                    disabled={isSubmittingFundRequest}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Maximum amount per request: ₹120,000
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fund-reason" className="text-sm font-medium">
                  Reason for Request
                </Label>
                <Select
                  value={fundRequestFormData.reason}
                  onValueChange={(value) => handleFundRequestInputChange('reason', value)}
                  disabled={isSubmittingFundRequest}
                >
                  <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500">
                    <SelectValue placeholder="Select reason for fund request" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marriage">Marriage Expenses</SelectItem>
                    <SelectItem value="medical">Medical Emergency</SelectItem>
                    <SelectItem value="education">Education Expenses</SelectItem>
                    <SelectItem value="family_emergency">Family Emergency</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fund-detailed-reason" className="text-sm font-medium">
                  Detailed Explanation
                </Label>
                <Textarea
                  id="fund-detailed-reason"
                  placeholder="Please provide detailed information about your fund request..."
                  value={fundRequestFormData.detailedReason}
                  onChange={(e) => handleFundRequestInputChange('detailedReason', e.target.value)}
                  className="min-h-[100px] border-slate-300 focus:border-blue-500"
                  required
                  disabled={isSubmittingFundRequest}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowFundRequestModal(false)}
              disabled={isSubmittingFundRequest}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFundRequestSubmit}
              disabled={isSubmittingFundRequest || !fundRequestFormData.amount || !fundRequestFormData.reason || !fundRequestFormData.detailedReason}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              {isSubmittingFundRequest ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4 mr-2" />
                  Submit Request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Wallet Deposit Dialog */}
      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-500 text-white">
                <Wallet className="h-5 w-5" />
              </div>
              Deposit to Wallet
            </DialogTitle>
            <DialogDescription>
              Add funds to your personal wallet for future use.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="wallet-amount" className="text-sm font-medium">
                  Deposit Amount (₹)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400">₹</span>
                  <Input
                    id="wallet-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={walletFormData.amount}
                    onChange={(e) => handleWalletInputChange('amount', e.target.value)}
                    className="h-12 pl-10 border-slate-300 focus:border-green-500"
                    required
                    min="1"
                    disabled={isSubmittingWallet}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="wallet-payment-method" className="text-sm font-medium">
                  Payment Method
                </Label>
                <Select
                  value={walletFormData.paymentMethod}
                  onValueChange={(value) => handleWalletInputChange('paymentMethod', value)}
                  disabled={isSubmittingWallet}
                >
                  <SelectTrigger className="h-12 border-slate-300 focus:border-green-500">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="upi">UPI Payment</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="debit_card">Debit Card</SelectItem>
                    <SelectItem value="net_banking">Net Banking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="wallet-transaction-id" className="text-sm font-medium">
                  Transaction ID / Reference Number
                </Label>
                <Input
                  id="wallet-transaction-id"
                  type="text"
                  placeholder="Enter transaction ID or reference number"
                  value={walletFormData.transactionId}
                  onChange={(e) => handleWalletInputChange('transactionId', e.target.value)}
                  className="h-12 border-slate-300 focus:border-green-500"
                  required
                  disabled={isSubmittingWallet}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="wallet-notes" className="text-sm font-medium">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="wallet-notes"
                  placeholder="Any additional information about this deposit..."
                  value={walletFormData.notes}
                  onChange={(e) => handleWalletInputChange('notes', e.target.value)}
                  className="min-h-[100px] border-slate-300 focus:border-green-500"
                  disabled={isSubmittingWallet}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowWalletModal(false)}
              disabled={isSubmittingWallet}
            >
              Cancel
            </Button>
            <Button
              onClick={handleWalletSubmit}
              disabled={isSubmittingWallet || !walletFormData.amount || !walletFormData.transactionId}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              {isSubmittingWallet ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Submit Deposit
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Team;
