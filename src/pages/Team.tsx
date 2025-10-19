import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTeamStructure, getUserTotalContributed, hasUserPaidThisMonth, mockUsers, getTotalCollected, getTotalSpent } from '@/lib/mockData';
import { User, CheckCircle, XCircle, Award, Users, Wallet, TrendingUp, Calendar, Plus, MessageSquare, CreditCard, DollarSign, Heart, FileCheck, AlertCircle, Trophy, Medal, Crown, Sparkles, Target, Zap, Star, ArrowUpRight, Eye, BarChart3, UserPlus, UserMinus, Settings, Shield, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect, useMemo, useCallback, memo } from 'react';

// Memoized Stat Card Component for Performance
const StatCard = memo(({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  gradient, 
  trend, 
  className = "" 
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: any;
  gradient: string;
  trend?: { value: number; label: string };
  className?: string;
}) => (
  <Card className={`group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${className}`}>
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
    <CardContent className="relative p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-6 w-6 text-slate-600 dark:text-slate-300" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="h-4 w-4" />
            {trend.value}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {value}
        </h3>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-500">
            {subtitle}
          </p>
        )}
      </div>
    </CardContent>
  </Card>
));

// Memoized Team Card Component
const TeamCard = memo(({ 
  team, 
  rank, 
  rankInfo 
}: {
  team: any;
  rank: number;
  rankInfo: any;
}) => {
  const RankIcon = rankInfo.icon;
  const leaderMarriageAmount = 120000;
  const leaderToCollect = leaderMarriageAmount - team.leaderTotalPaid;

  return (
    <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.01] border-0 bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-sm">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-slate-800/10" />
      
      <CardHeader className="relative">
        {/* Team Totals Section */}
        <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200/50 dark:border-slate-700/50">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Team Totals
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {team.members.length + 1} members
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Rank Icon Badge */}
              <div className={`${rankInfo.bgColor} ${rankInfo.borderColor} border-2 rounded-full p-3 shadow-lg backdrop-blur-sm transform hover:scale-110 transition-transform duration-300`}>
                <RankIcon className={`h-6 w-6 ${rankInfo.color}`} />
              </div>
              {/* Rank Text Badge */}
              <Badge variant="outline" className={`${rankInfo.color} ${rankInfo.borderColor} border-2 font-bold text-base px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300`}>
                🏆 Rank #{rank}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Total Target</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                ₹{team.teamTotalTarget.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">To Collect</p>
              <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                ₹{team.teamTotalToCollect.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Total Paid</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                ₹{team.teamTotalPaid.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Progress</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {team.teamProgress.toFixed(1)}%
              </p>
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
              <span>Team Progress</span>
              <span>{team.teamProgress.toFixed(1)}%</span>
            </div>
            <div className="relative w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(team.teamProgress, 100)}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-6">
        {/* Responsible Member */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                  {team.responsible_member.name}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Responsible Member • {team.responsible_member.marital_status}
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                ₹{team.leaderTotalPaid.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Paid</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Target</p>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                ₹{leaderMarriageAmount.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">To Collect</p>
              <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                ₹{leaderToCollect.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Progress</p>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {((team.leaderTotalPaid / leaderMarriageAmount) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
              <span>Progress</span>
              <span>{((team.leaderTotalPaid / leaderMarriageAmount) * 100).toFixed(1)}%</span>
            </div>
            <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((team.leaderTotalPaid / leaderMarriageAmount) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Individual Members */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <User className="h-4 w-4" />
            Individual Members ({team.members.length})
          </h4>
          <div className="grid gap-3">
            {team.members.map((member: any) => {
              const memberTotalPaid = getUserTotalContributed(member.id);
              const memberMarriageAmount = 120000;
              const memberToCollect = memberMarriageAmount - memberTotalPaid;
              const memberProgress = (memberTotalPaid / memberMarriageAmount) * 100;

              return (
                <div key={member.id} className="group/member p-4 rounded-2xl bg-gradient-to-br from-slate-50/50 to-white/50 dark:from-slate-800/30 dark:to-slate-900/30 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white shadow-md group-hover/member:scale-110 transition-transform duration-300">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{member.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{member.marital_status}</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{memberTotalPaid.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Paid</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-center mb-3">
                    <div className="p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Target</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        ₹{memberMarriageAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">To Collect</p>
                      <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                        ₹{memberToCollect.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Progress</p>
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {memberProgress.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                      <span>Progress</span>
                      <span>{memberProgress.toFixed(1)}%</span>
                    </div>
                    <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min(memberProgress, 100)}%` }}
                      />
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
});

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
  const [hasAcknowledgedTerms, setHasAcknowledgedTerms] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  
  // Team Management States
  const [showTeamManagementModal, setShowTeamManagementModal] = useState(false);
  const [teamManagementMode, setTeamManagementMode] = useState<'add_member' | 'assign_member' | 'remove_member'>('add_member');
  const [teamManagementFormData, setTeamManagementFormData] = useState({
    memberName: '',
    username: '',
    maritalStatus: 'Unmarried',
    assignedAmount: '',
    responsibleMemberId: '',
    selectedMemberId: ''
  });
  const [isSubmittingTeamManagement, setIsSubmittingTeamManagement] = useState(false);
  const [teamManagementErrors, setTeamManagementErrors] = useState<{[key: string]: string}>({});

  // Check if terms have been acknowledged
  useEffect(() => {
    const acknowledged = localStorage.getItem('cbms-terms-acknowledged');
    setHasAcknowledgedTerms(acknowledged === 'true');
  }, []);

  // Memoized calculations for performance
  const fundStats = useMemo(() => {
  const totalUsers = mockUsers.filter(u => u.role !== 'admin').length;
    const totalMarriageAmount = totalUsers * 120000;
  const totalPaidAmount = getTotalCollected();
    const spendAmount = getTotalSpent();
    const balanceAmount = totalPaidAmount - spendAmount;
    const toCollectAmount = totalMarriageAmount - totalPaidAmount;
    const progressPercentage = (totalPaidAmount / totalMarriageAmount) * 100;

    return {
      totalUsers,
      totalMarriageAmount,
      totalPaidAmount,
      spendAmount,
      balanceAmount,
      toCollectAmount,
      progressPercentage
    };
  }, []);

  const teamsWithRanking = useMemo(() => {
    const teams = getTeamStructure();
    return teams.map((team) => {
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
  }, []);

  // Memoized rank icon helper
  const getRankIcon = useCallback((rank: number) => {
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
  }, []);

  const handleTermsAcknowledgment = useCallback(() => {
    localStorage.setItem('cbms-terms-acknowledged', 'true');
    setHasAcknowledgedTerms(true);
    setShowTermsDialog(false);
  }, []);

  const handleFundRequestClick = useCallback(() => {
    if (!hasAcknowledgedTerms) {
      setShowTermsDialog(true);
    } else {
      setShowFundRequestModal(true);
    }
  }, [hasAcknowledgedTerms]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
      </div>
    );
  }
  
  if (!currentUser) return null;

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

  // Team Management Handlers
  const handleTeamManagementInputChange = (field: string, value: string) => {
    setTeamManagementFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (teamManagementErrors[field]) {
      setTeamManagementErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateTeamManagementForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (teamManagementMode === 'add_member') {
      if (!teamManagementFormData.memberName) {
        newErrors.memberName = 'Please enter member name';
      }
      if (!teamManagementFormData.username) {
        newErrors.username = 'Please enter username';
      }
      if (!teamManagementFormData.assignedAmount) {
        newErrors.assignedAmount = 'Please enter assigned amount';
      } else if (parseFloat(teamManagementFormData.assignedAmount) <= 0) {
        newErrors.assignedAmount = 'Amount must be greater than 0';
      }
      if (!teamManagementFormData.responsibleMemberId) {
        newErrors.responsibleMemberId = 'Please select responsible member';
      }
    } else if (teamManagementMode === 'assign_member') {
      if (!teamManagementFormData.selectedMemberId) {
        newErrors.selectedMemberId = 'Please select a member';
      }
      if (!teamManagementFormData.responsibleMemberId) {
        newErrors.responsibleMemberId = 'Please select responsible member';
      }
    } else if (teamManagementMode === 'remove_member') {
      if (!teamManagementFormData.selectedMemberId) {
        newErrors.selectedMemberId = 'Please select a member to remove';
      }
    }
    
    setTeamManagementErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTeamManagementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTeamManagementForm()) {
      return;
    }

    setIsSubmittingTeamManagement(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Team management action submitted:', {
        mode: teamManagementMode,
        data: teamManagementFormData,
        user: currentUser.name
      });

      // Reset form and close modal
      setTeamManagementFormData({
        memberName: '',
        username: '',
        maritalStatus: 'Unmarried',
        assignedAmount: '',
        responsibleMemberId: '',
        selectedMemberId: ''
      });
      setTeamManagementErrors({});
      setShowTeamManagementModal(false);
      
      console.log('Team management action completed successfully!');
    } catch (error) {
      console.error('Error submitting team management action:', error);
    } finally {
      setIsSubmittingTeamManagement(false);
    }
  };


  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">View team performance and manage team members</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {canRequestFunds && (
            <Dialog open={showFundRequestModal} onOpenChange={setShowFundRequestModal}>
              <DialogTrigger asChild>
                <Button 
                  onClick={handleFundRequestClick}
                  size="lg"
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Heart className="h-5 w-5 mr-2 relative z-10" />
                  <span className="relative z-10 font-semibold">Request Fund</span>
                </Button>
              </DialogTrigger>
            </Dialog>
          )}
          {canDepositWallet && (
            <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
              <DialogTrigger asChild>
                <Button 
                  size="lg"
                  variant="outline"
                  className="group relative overflow-hidden border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Wallet className="h-5 w-5 mr-2 relative z-10" />
                  <span className="relative z-10 font-semibold">Deposit Wallet</span>
                </Button>
              </DialogTrigger>
            </Dialog>
          )}
      </div>

      {/* Team Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-blue-500 text-white flex-shrink-0">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">Total Members</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 dark:text-blue-100">{fundStats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-emerald-500 text-white flex-shrink-0">
                <Target className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400">Total Marriage Fund</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-900 dark:text-emerald-100">₹{fundStats.totalMarriageAmount.toLocaleString('en-IN')}</p>
                <p className="text-xs text-emerald-500 dark:text-emerald-400">₹120,000 per user</p>
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
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900 dark:text-purple-100">₹{fundStats.totalPaidAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border-red-200 dark:border-red-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-red-500 text-white flex-shrink-0">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-red-600 dark:text-red-400">Spend Amount</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-900 dark:text-red-100">₹{fundStats.spendAmount.toLocaleString('en-IN')}</p>
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
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-900 dark:text-cyan-100">₹{fundStats.balanceAmount.toLocaleString('en-IN')}</p>
                <p className="text-xs text-cyan-500 dark:text-cyan-400">Available funds</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-orange-950/30 border-orange-200 dark:border-orange-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-orange-500 text-white flex-shrink-0">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-orange-600 dark:text-orange-400">To Collect</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-900 dark:text-orange-100">₹{fundStats.toCollectAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Progress Section */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-sm shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <BarChart3 className="h-6 w-6" />
              </div>
            Fund Collection Progress
          </CardTitle>
            <p className="text-slate-600 dark:text-slate-400">
              Real-time tracking of fund collection and disbursement progress
            </p>
        </CardHeader>
          <CardContent className="relative space-y-8">
      <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Collection Progress</span>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  ₹{fundStats.totalPaidAmount.toLocaleString('en-IN')} / ₹{fundStats.totalMarriageAmount.toLocaleString('en-IN')}
              </span>
            </div>
              <div className="relative">
                <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${Math.min(fundStats.progressPercentage, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                    </div>
                  </div>
                <div className="text-center mt-2">
                  <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {fundStats.progressPercentage.toFixed(1)}%
                </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">Collected</span>
                </div>
                    </div>
                  </div>
                  
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900/50">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    ₹{fundStats.balanceAmount.toLocaleString('en-IN')}
                    </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Available Balance</div>
                    </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900/50">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    ₹{fundStats.totalPaidAmount.toLocaleString('en-IN')}
                    </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Total Collected</div>
                  </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900/50">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    ₹{fundStats.spendAmount.toLocaleString('en-IN')}
                    </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Total Disbursed</div>
                    </div>
                  </div>
                </div>
          </CardContent>
        </Card>
      {/* Team Cards Section */}
      <div className="space-y-8">
          {teamsWithRanking.map((team, index) => {
            const rank = index + 1;
            const rankInfo = getRankIcon(rank);
            const isTopThree = rank <= 3;

                    return (
              <div key={team.responsible_member.id} className={`relative ${isTopThree ? 'transform hover:scale-[1.02] transition-all duration-300' : ''}`}>
                {isTopThree && (
                  <div className="absolute -top-2 -left-2 z-10">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
                      rank === 1 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                      rank === 2 ? 'bg-gradient-to-r from-gray-500 to-gray-600' :
                      'bg-gradient-to-r from-amber-500 to-amber-600'
                    }`}>
                      {rank === 1 ? `🥇 CHAMPION ${team.responsible_member.name} Team` : rank === 2 ? `🥈 RUNNER-UP ${team.responsible_member.name}` : `🥉 THIRD PLACE ${team.responsible_member.name}`}
                              </div>
                              </div>
                )}
                <TeamCard
                  team={team}
                  rank={rank}
                  rankInfo={rankInfo}
                />
                      </div>
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

      {/* Terms of Use Dialog */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="w-[95vw] max-w-[95vw] sm:w-auto sm:max-w-2xl mx-2 sm:mx-4 h-[90vh] sm:h-auto max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-500 text-white">
                <FileCheck className="h-5 w-5" />
              </div>
              Terms of Use Required
            </DialogTitle>
            <DialogDescription>
              You must acknowledge the Terms of Use before requesting funds
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                    Terms of Use Required
                  </h4>
                  <p className="text-amber-800 dark:text-amber-200 text-sm">
                    Before you can request funds from the CBMS Marriage Fund, you must read and acknowledge our Terms of Use. 
                    This ensures you understand the rules, responsibilities, and procedures of the fund.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Key Points from Terms of Use:
              </h4>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>• Each member contributes ₹5,000 per marriage</li>
                <li>• 45-day advance notice required for marriage</li>
                <li>• Payment due one week before marriage</li>
                <li>• Fund disbursement on marriage day or day before</li>
                <li>• One-month grace period for late payments</li>
                <li>• All transactions must be recorded and verified</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowTermsDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTermsAcknowledgment}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              <FileCheck className="h-4 w-4 mr-2" />
              I Acknowledge & Accept Terms
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Team;
