import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockFundRequests, getTotalSpent, mockUsers } from '@/lib/mockData';
import { FileText, CheckCircle, XCircle, Clock, TrendingUp, Users, DollarSign, Calendar, MessageSquare, Timer, CreditCard, AlertCircle } from 'lucide-react';
import DatePicker from '@/components/ui/date-picker';

const FundRequests = () => {
  const { currentUser, isLoading } = useAuth();
  
  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(undefined);
  const [declineReason, setDeclineReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) return null;


  // Handle approve request
  const handleApproveRequest = (request: any) => {
    setSelectedRequest(request);
    // Set default payment date to 45 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 45);
    setPaymentDate(defaultDate);
    setShowApproveModal(true);
  };

  // Handle decline request
  const handleDeclineRequest = (request: any) => {
    setSelectedRequest(request);
    setDeclineReason('');
    setShowDeclineModal(true);
  };

  // Process approval
  const processApproval = async () => {
    if (!paymentDate) {
      console.log("Error: Please select a payment date");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Request approved for ${selectedRequest.user_name}`);
      console.log(`Payment scheduled for: ${paymentDate.toLocaleDateString()}`);
      console.log(`Amount: ₹${selectedRequest.amount.toLocaleString('en-IN')}`);
      
      // Close modal and reset state
      setShowApproveModal(false);
      setSelectedRequest(null);
      setPaymentDate(undefined);
      
      // Here you would typically update the request status in your data store
      // For now, we'll just show a success message
      console.log("Fund request approved successfully!");
      
    } catch (error) {
      console.log("Error approving request:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Process decline
  const processDecline = async () => {
    if (!declineReason.trim()) {
      console.log("Error: Please provide a reason for declining");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Request declined for ${selectedRequest.user_name}`);
      console.log(`Reason: ${declineReason}`);
      
      // Close modal and reset state
      setShowDeclineModal(false);
      setSelectedRequest(null);
      setDeclineReason('');
      
      // Here you would typically update the request status in your data store
      console.log("Fund request declined successfully!");
      
    } catch (error) {
      console.log("Error declining request:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Close modals
  const closeModals = () => {
    setShowApproveModal(false);
    setShowDeclineModal(false);
    setSelectedRequest(null);
    setPaymentDate(undefined);
    setDeclineReason('');
  };

  // Calculate remaining days until payment
  const getRemainingDays = (paymentDate: string) => {
    const today = new Date();
    const payment = new Date(paymentDate);
    const diffTime = payment.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (request: any) => {
    switch (request.status) {
      case 'approved':
        if (request.payment_status === 'paid') {
        return (
            <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
              Paid (₹{request.paid_amount?.toLocaleString('en-IN')})
            </Badge>
          );
        } else if (request.payment_status === 'partial') {
          const remainingDays = request.payment_date ? getRemainingDays(request.payment_date) : 0;
          return (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800">
              <CreditCard className="mr-1 h-3 w-3" />
              Partial (₹{request.paid_amount?.toLocaleString('en-IN')})
            </Badge>
          );
        } else {
          const remainingDays = request.payment_date ? getRemainingDays(request.payment_date) : 0;
          return (
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
              <Timer className="mr-1 h-3 w-3" />
              {remainingDays > 0 ? `${remainingDays} days left` : 'Payment due'}
          </Badge>
        );
        }
      case 'declined':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Declined
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-primary text-primary">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  // Filter requests based on role and active tab
  const filteredRequests = useMemo(() => {
    if (currentUser.role === 'admin') {
      return mockFundRequests; // Admins always see all requests
    }

    if (activeTab === 'all') {
      return mockFundRequests;
    } else { // activeTab === 'my'
      return mockFundRequests.filter(r => r.user_id === currentUser.id);
    }
  }, [currentUser.role, activeTab, currentUser.id]);

  // Sort requests by request date (most recent first)
  const sortedRequests = useMemo(() => {
    return [...filteredRequests].sort((a, b) => new Date(b.requested_date).getTime() - new Date(a.requested_date).getTime());
  }, [filteredRequests]);

  const visibleRequests = sortedRequests;

  // Determine card title and description based on role and active tab
  const getCardTitle = () => {
    if (currentUser.role === 'admin') return 'All Fund Requests';
    if (activeTab === 'all') return 'All Fund Requests';
    return 'My Fund Requests';
  };

  const getCardDescription = () => {
    if (currentUser.role === 'admin') {
      return 'Review and approve fund requests from all members';
    }
    if (currentUser.role === 'responsible_member') {
      return activeTab === 'all'
        ? 'Review all fund requests and approve/decline requests from your team members'
        : 'Track your fund request status and history for your own requests';
    }
    // For regular members
    return activeTab === 'all'
      ? 'View all fund requests in the system'
      : 'Track your fund request status and history';
  };

  // Check if responsible member can approve/decline a request
  const canApproveDecline = (request: any) => {
    if (currentUser.role === 'admin') {
      return true; // Admins can approve/decline all requests
    }
    if (currentUser.role === 'responsible_member') {
      // Responsible members can only approve/decline requests from their team members
      const requestUser = mockUsers.find(u => u.id === request.user_id);
      return requestUser?.responsible_member_id === currentUser.id;
    }
    return false; // Regular members cannot approve/decline
  };

  // Calculate fund request statistics
  const totalRequests = mockFundRequests.length;
  const pendingRequests = mockFundRequests.filter(r => r.status === 'pending').length;
  const approvedRequests = mockFundRequests.filter(r => r.status === 'approved').length;
  const declinedRequests = mockFundRequests.filter(r => r.status === 'declined').length;
  const totalRequestedAmount = mockFundRequests.reduce((sum, r) => sum + r.amount, 0);
  const approvedAmount = getTotalSpent(); // Total amount from approved requests
  const pendingAmount = mockFundRequests
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Fund Requests</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Request and manage fund disbursements</p>
        </div>
      </div>

      {/* Fund Request Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-blue-500 text-white flex-shrink-0">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">Total Requests</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 dark:text-blue-100">{totalRequests}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-green-500 text-white flex-shrink-0">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">Approved</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900 dark:text-green-100">{approvedRequests}</p>
                <p className="text-xs text-green-500 dark:text-green-400">₹{approvedAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-orange-950/30 border-orange-200 dark:border-orange-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-orange-500 text-white flex-shrink-0">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-orange-600 dark:text-orange-400">Pending</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-900 dark:text-orange-100">{pendingRequests}</p>
                <p className="text-xs text-orange-500 dark:text-orange-400">₹{pendingAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border-red-200 dark:border-red-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-red-500 text-white flex-shrink-0">
                <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-red-600 dark:text-red-400">Declined</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-900 dark:text-red-100">{declinedRequests}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border-purple-200 dark:border-purple-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-purple-500 text-white flex-shrink-0">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400">Total Requested</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900 dark:text-purple-100">₹{totalRequestedAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-cyan-200 dark:border-cyan-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-cyan-500 text-white flex-shrink-0">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-cyan-600 dark:text-cyan-400">Approval Rate</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-900 dark:text-cyan-100">
                  {totalRequests > 0 ? ((approvedRequests / totalRequests) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Fund Requests Table Section */}
      {currentUser.role !== 'admin' && (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'my')} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 h-18 bg-slate-100 dark:bg-slate-800">
            <TabsTrigger 
              value="all" 
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-slate-100"
            >
              All Requests
            </TabsTrigger>
            <TabsTrigger 
              value="my" 
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-slate-100"
            >
              My Requests
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <div className="p-2 rounded-lg bg-slate-500 text-white">
              <MessageSquare className="h-5 w-5" />
            </div>
            {getCardTitle()}
          </CardTitle>
          <CardDescription className="text-slate-700 dark:text-slate-300">
            {getCardDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <div className="rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-100 dark:bg-slate-800">
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Member</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Amount</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Reason</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Request Date</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Status</TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Payment Info</TableHead>
                    {(currentUser.role === 'admin' || currentUser.role === 'responsible_member') && <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={(currentUser.role === 'admin' || currentUser.role === 'responsible_member') ? 7 : 6} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800">
                            <FileText className="h-6 w-6 text-slate-400" />
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 font-medium">No fund requests found</p>
                          <p className="text-sm text-slate-400 dark:text-slate-500">
                            {currentUser.role === 'member' ? 'Submit your first fund request above' : 'No requests to review'}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    visibleRequests.map(request => (
                      <TableRow key={request.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="h-4 w-4 text-primary" />
                            </div>
                            {request.user_name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
                            ₹{request.amount.toLocaleString('en-IN')}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate text-slate-700 dark:text-slate-300" title={request.reason}>
                            {request.reason}
                          </p>
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-400">
                          {request.requested_date}
                        </TableCell>
                        <TableCell>{getStatusBadge(request)}</TableCell>
                        <TableCell>
                          {request.status === 'approved' ? (
                            <div className="space-y-1">
                              {request.payment_date && (
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                  Due: {new Date(request.payment_date).toLocaleDateString()}
                                </p>
                              )}
                              {request.paid_amount !== undefined && (
                                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                  Paid: ₹{request.paid_amount.toLocaleString('en-IN')} / ₹{request.amount.toLocaleString('en-IN')}
                                </p>
                              )}
                              {request.payment_status === 'pending' && request.payment_date && (
                                <p className="text-xs text-orange-600 dark:text-orange-400">
                                  {getRemainingDays(request.payment_date)} days remaining
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-slate-500">-</span>
                          )}
                        </TableCell>
                        {(currentUser.role === 'admin' || currentUser.role === 'responsible_member') && (
                          <TableCell>
                            {request.status === 'pending' && canApproveDecline(request) && (
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleApproveRequest(request)}
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleDeclineRequest(request)}
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Decline
                                </Button>
                              </div>
                            )}
                            {request.status === 'pending' && !canApproveDecline(request) && (
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                Not authorized
                              </span>
                            )}
                            {request.status !== 'pending' && (
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {request.status === 'approved' ? 'Processed' : 'Completed'}
                              </span>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {visibleRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800">
                    <FileText className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No fund requests found</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    {currentUser.role === 'member' ? 'Submit your first fund request above' : 'No requests to review'}
                  </p>
                </div>
              </div>
            ) : (
              visibleRequests.map(request => (
                <Card key={request.id} className="bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-700/80 border-slate-200 dark:border-slate-600">
                  <CardContent className="p-4">
                    {/* Header with Member and Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{request.user_name}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{request.requested_date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(request)}
                      </div>
                    </div>

                    {/* Amount and Reason */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Amount</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
                          ₹{request.amount.toLocaleString('en-IN')}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Reason</span>
                        <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{request.reason}</p>
                      </div>
                    </div>

                    {/* Payment Info */}
                    {request.status === 'approved' && (
                      <div className="space-y-2 mb-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Payment Information</h4>
                        {request.payment_date && (
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            Due: {new Date(request.payment_date).toLocaleDateString()}
                          </p>
                        )}
                        {request.paid_amount !== undefined && (
                          <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                            Paid: ₹{request.paid_amount.toLocaleString('en-IN')} / ₹{request.amount.toLocaleString('en-IN')}
                          </p>
                        )}
                        {request.payment_status === 'pending' && request.payment_date && (
                          <p className="text-xs text-orange-600 dark:text-orange-400">
                            {getRemainingDays(request.payment_date)} days remaining
                          </p>
                        )}
                      </div>
                    )}

                    {/* Actions for Admins and Responsible Members */}
                    {(currentUser.role === 'admin' || currentUser.role === 'responsible_member') && (
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-600">
                        {request.status === 'pending' && canApproveDecline(request) ? (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleApproveRequest(request)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              className="flex-1 bg-red-600 hover:bg-red-700"
                              onClick={() => handleDeclineRequest(request)}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Decline
                            </Button>
                          </div>
                        ) : request.status === 'pending' && !canApproveDecline(request) ? (
                          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                            Not authorized to approve/decline
                          </p>
                        ) : (
                          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                            {request.status === 'approved' ? 'Request Processed' : 'Request Completed'}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Approve Request Dialog */}
      <Dialog open={showApproveModal} onOpenChange={closeModals}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-500 text-white">
                <CheckCircle className="h-5 w-5" />
              </div>
              Approve Fund Request
            </DialogTitle>
            <DialogDescription>
              Schedule payment for {selectedRequest?.user_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
              {/* Request Details */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">Request Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Member:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{selectedRequest?.user_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Amount:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      ₹{selectedRequest?.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Reason:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{selectedRequest?.reason}</span>
                  </div>
                </div>
              </div>

              {/* Payment Date Selection */}
              <div className="grid gap-2">
                <Label htmlFor="payment-date" className="text-sm font-medium">
                  Payment Date
                </Label>
                <DatePicker
                  value={paymentDate ? paymentDate.toISOString().split('T')[0] : ''}
                  onChange={(dateString) => setPaymentDate(new Date(dateString))}
                  placeholder="Select payment date"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Payment will be scheduled for the selected date (typically 45 days from approval)
                </p>
              </div>

              {/* Approval Notice */}
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Approval Notice</p>
                    <p className="text-blue-700 dark:text-blue-300">
                      This will approve the fund request and schedule payment. The member will be notified of the approval and payment date.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeModals}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={processApproval}
              disabled={isProcessing || !paymentDate}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline Request Dialog */}
      <Dialog open={showDeclineModal} onOpenChange={closeModals}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-500 text-white">
                <XCircle className="h-5 w-5" />
              </div>
              Decline Fund Request
            </DialogTitle>
            <DialogDescription>
              Provide reason for declining {selectedRequest?.user_name}'s request
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
              {/* Request Details */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">Request Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Member:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{selectedRequest?.user_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Amount:</span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      ₹{selectedRequest?.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Reason:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{selectedRequest?.reason}</span>
                  </div>
                </div>
              </div>

              {/* Decline Reason */}
              <div className="grid gap-2">
                <Label htmlFor="decline-reason" className="text-sm font-medium">
                  Reason for Declining *
                </Label>
                <Textarea
                  id="decline-reason"
                  placeholder="Please provide a clear reason for declining this fund request..."
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="min-h-[100px] border-slate-300 focus:border-red-500"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This reason will be shared with the member
                </p>
              </div>

              {/* Decline Notice */}
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-red-900 dark:text-red-100 mb-1">Decline Notice</p>
                    <p className="text-red-700 dark:text-red-300">
                      This will decline the fund request. The member will be notified with the reason provided.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeModals}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={processDecline}
              disabled={isProcessing || !declineReason.trim()}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline Request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default FundRequests;
