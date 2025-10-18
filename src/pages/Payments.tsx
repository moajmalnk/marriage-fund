import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import DatePicker from '@/components/ui/date-picker';
import PaymentModal from '@/components/ui/payment-modal';
import { mockUsers, mockPayments } from '@/lib/mockData';
import { Plus, History, User, DollarSign, Calendar, FileText, CheckCircle2, AlertCircle, Edit, Trash2, MoreHorizontal, TrendingUp, Wallet, CreditCard, Users, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Payments = () => {
  const { currentUser, isLoading } = useAuth();
  const [selectedMember, setSelectedMember] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // CRUD Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete'>('create');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [payments, setPayments] = useState(mockPayments);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) return null;

  // Get members based on user role
  const getAvailableMembers = () => {
    if (currentUser.role === 'admin') {
      return mockUsers.filter(u => u.role !== 'admin');
    } else if (currentUser.role === 'responsible_member') {
      return mockUsers.filter(u => u.responsible_member_id === currentUser.id);
    }
    return [];
  };

  const availableMembers = getAvailableMembers();

  // CRUD Handlers
  const handleCreatePayment = () => {
    setModalMode('create');
    setSelectedPayment(null);
    setIsModalOpen(true);
  };

  const handleEditPayment = (payment: any) => {
    setModalMode('edit');
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleDeletePayment = (payment: any) => {
    setModalMode('delete');
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleSavePayment = (paymentData: any) => {
    if (modalMode === 'create') {
      const newPayment = {
        id: Date.now().toString(),
        ...paymentData,
        recorded_by_name: currentUser.name
      };
      setPayments(prev => [newPayment, ...prev]);
      console.log('Payment created:', newPayment);
    } else if (modalMode === 'edit' && selectedPayment) {
      const updatedPayment = {
        ...selectedPayment,
        ...paymentData
      };
      setPayments(prev => prev.map(p => p.id === selectedPayment.id ? updatedPayment : p));
      console.log('Payment updated:', updatedPayment);
    }
  };

  const handleDeleteConfirm = (paymentId: string) => {
    setPayments(prev => prev.filter(p => p.id !== paymentId));
    console.log('Payment deleted:', paymentId);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!selectedMember) {
      newErrors.member = 'Please select a member';
    }
    
    if (!amount) {
      newErrors.amount = 'Please enter the payment amount';
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!paymentDate) {
      newErrors.date = 'Please select the payment date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log(`Payment Recorded: Payment of ₹${amount} recorded successfully for ${selectedMember}`);
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form
      setSelectedMember('');
      setAmount('');
      setPaymentDate('');
      setNotes('');
      setErrors({});
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error recording payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter payments based on role
  const visiblePayments = currentUser.role === 'admin' 
    ? payments 
    : currentUser.role === 'responsible_member'
    ? payments.filter(p => {
        const user = mockUsers.find(u => u.id === p.user_id);
        return user?.responsible_member_id === currentUser.id || p.user_id === currentUser.id;
      })
    : payments.filter(p => p.user_id === currentUser.id);

  // Calculate payment statistics
  const totalPayments = visiblePayments.length;
  const totalAmount = visiblePayments.reduce((sum, p) => sum + p.amount, 0);
  const thisMonthPayments = visiblePayments.filter(p => {
    const paymentDate = new Date(p.date);
    const now = new Date();
    return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
  }).length;
  const thisMonthAmount = visiblePayments.filter(p => {
    const paymentDate = new Date(p.date);
    const now = new Date();
    return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
  }).reduce((sum, p) => sum + p.amount, 0);
  const averagePayment = totalPayments > 0 ? totalAmount / totalPayments : 0;
  const uniqueMembers = new Set(visiblePayments.map(p => p.user_id)).size;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Payment Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Record and view payment history</p>
        </div>
      </div>

      {/* Payment Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-blue-500 text-white flex-shrink-0">
                <History className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">Total Payments</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 dark:text-blue-100">{totalPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-green-500 text-white flex-shrink-0">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">Total Amount</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900 dark:text-green-100">₹{totalAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border-purple-200 dark:border-purple-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-purple-500 text-white flex-shrink-0">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400">This Month</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900 dark:text-purple-100">{thisMonthPayments}</p>
                <p className="text-xs text-purple-500 dark:text-purple-400">₹{thisMonthAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-orange-950/30 border-orange-200 dark:border-orange-800">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-orange-500 text-white flex-shrink-0">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-orange-600 dark:text-orange-400">Average Payment</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-900 dark:text-orange-100">₹{averagePayment.toLocaleString('en-IN')}</p>
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
                <p className="text-xs sm:text-sm font-medium text-cyan-600 dark:text-cyan-400">Active Members</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-900 dark:text-cyan-100">{uniqueMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-600">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-500 text-white flex-shrink-0">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Last Payment</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {visiblePayments.length > 0 ? new Date(visiblePayments[0].date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Record Payment Form - Only for Admin and Responsible Members */}
      {(currentUser.role === 'admin' || currentUser.role === 'responsible_member') && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <div className="p-2 rounded-lg bg-blue-500 text-white">
                <Plus className="h-5 w-5" />
              </div>
              Record New Payment
            </CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300">
              {currentUser.role === 'admin' 
                ? 'Record payment for any community member' 
                : 'Record payment for your assigned members'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Success Message */}
            {showSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Payment recorded successfully!
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      The payment has been added to the system records.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleRecordPayment} className="space-y-6">
              {/* Member Selection */}
              <div className="space-y-2">
                <Label htmlFor="member" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Select Member
                </Label>
                <Select value={selectedMember} onValueChange={(value) => {
                  setSelectedMember(value);
                  if (errors.member) {
                    setErrors(prev => ({ ...prev, member: '' }));
                  }
                }}>
                  <SelectTrigger className={`w-full h-12 px-4 border-2 transition-all duration-200 ${
                    errors.member 
                      ? 'border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-400' 
                      : 'border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500'
                  }`}>
                    <SelectValue placeholder="Choose a member to record payment for" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
                    {availableMembers.map(member => {
                      // Calculate paid amount for this member
                      const memberPayments = payments.filter(p => p.user_id === member.id);
                      const paidAmount = memberPayments.reduce((sum, p) => sum + p.amount, 0);
                      const targetAmount = 120000; // ₹120,000 marriage fund target
                      
                      return (
                        <SelectItem key={member.id} value={member.id} className="py-3">
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium">{member.name}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              ₹{paidAmount.toLocaleString('en-IN')} / ₹{targetAmount.toLocaleString('en-IN')}
                            </Badge>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.member && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {errors.member}
                  </div>
                )}
              </div>

              {/* Amount and Date Row */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Payment Amount
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 font-medium">
                      ₹
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        if (errors.amount) {
                          setErrors(prev => ({ ...prev, amount: '' }));
                        }
                      }}
                      className={`h-12 pl-10 pr-4 border-2 transition-all duration-200 ${
                        errors.amount 
                          ? 'border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-400' 
                          : 'border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                  {errors.amount && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.amount}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Payment Date
                  </Label>
                  <DatePicker
                    value={paymentDate}
                    onChange={(date) => {
                      setPaymentDate(date);
                      if (errors.date) {
                        setErrors(prev => ({ ...prev, date: '' }));
                      }
                    }}
                    placeholder="Select payment date"
                    error={!!errors.date}
                  />
                  {errors.date && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.date}
                    </div>
                  )}
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional information about this payment..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px] border-2 border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Recording Payment...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Record Payment
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <div className="p-2 rounded-lg bg-slate-500 text-white">
              <History className="h-5 w-5" />
            </div>
            Payment History
          </CardTitle>
          <CardDescription className="text-slate-700 dark:text-slate-300">
            Complete transaction log with timestamps and payment details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100 dark:bg-slate-800">
                  <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Date</TableHead>
                  <TableHead className="font-semibold text-slate-900 dark:text-slate-100 hidden sm:table-cell">Time</TableHead>
                  <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Member</TableHead>
                  <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Amount</TableHead>
                  <TableHead className="font-semibold text-slate-900 dark:text-slate-100 hidden md:table-cell">Recorded By</TableHead>
                  {(currentUser.role === 'admin' || currentUser.role === 'responsible_member') && (
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-100 w-12">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {visiblePayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={currentUser.role === 'admin' || currentUser.role === 'responsible_member' ? 6 : 5} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800">
                          <History className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">No payment records found</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                          {currentUser.role === 'member' ? 'Your payment history will appear here' : 'Payment records will appear here'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  visiblePayments.map(payment => {
                    const member = mockUsers.find(u => u.id === payment.user_id);
                    return (
                      <TableRow key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <TableCell className="font-medium text-slate-900 dark:text-slate-100">{payment.date}</TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-400 hidden sm:table-cell">{payment.time}</TableCell>
                        <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            {member?.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
                            ₹{payment.amount.toLocaleString('en-IN')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-400 hidden md:table-cell">{payment.recorded_by_name}</TableCell>
                        {(currentUser.role === 'admin' || currentUser.role === 'responsible_member') && (
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => handleEditPayment(payment)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Payment
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeletePayment(payment)}
                                  className="text-red-600 dark:text-red-400"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Payment
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSavePayment}
        onDelete={handleDeleteConfirm}
        payment={selectedPayment}
        users={availableMembers}
        currentUserName={currentUser.name}
        mode={modalMode}
      />
    </div>
  );
};

export default Payments;
