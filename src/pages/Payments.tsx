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
import { Plus, History, User, DollarSign, Calendar, FileText, CheckCircle2, AlertCircle, Edit, Trash2, MoreHorizontal } from 'lucide-react';
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

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Payment Management</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Record and view payment history</p>
      </div>

      {/* Record Payment Form - Only for Admin and Responsible Members */}
      {(currentUser.role === 'admin' || currentUser.role === 'responsible_member') && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Record New Payment
                </CardTitle>
                <CardDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {currentUser.role === 'admin' 
                    ? 'Record payment for any community member' 
                    : 'Record payment for your assigned members'}
                </CardDescription>
              </div>
            </div>
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
              <div className="space-y-3">
                <Label htmlFor="member" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
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
                      : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400'
                  }`}>
                    <SelectValue placeholder="Choose a member to record payment for" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
                    {availableMembers.map(member => (
                      <SelectItem key={member.id} value={member.id} className="py-3">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">{member.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            ₹{member.assigned_monthly_amount}/month
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
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
                <div className="space-y-3">
                  <Label htmlFor="amount" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
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
                          : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400'
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

                <div className="space-y-3">
                  <Label htmlFor="date" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
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
              <div className="space-y-3">
                <Label htmlFor="notes" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional information about this payment..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px] border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 resize-none"
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <History className="h-5 w-5 shrink-0" />
            <span>Payment History</span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">Complete transaction log with timestamps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Date</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Time</TableHead>
                  <TableHead className="text-xs sm:text-sm">Member</TableHead>
                  <TableHead className="text-xs sm:text-sm">Amount</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden md:table-cell">Recorded By</TableHead>
                  {(currentUser.role === 'admin' || currentUser.role === 'responsible_member') && (
                    <TableHead className="text-xs sm:text-sm w-12">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {visiblePayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={currentUser.role === 'admin' || currentUser.role === 'responsible_member' ? 6 : 5} className="text-center py-8 text-xs sm:text-sm text-muted-foreground">
                      No payment records found
                    </TableCell>
                  </TableRow>
                ) : (
                  visiblePayments.map(payment => {
                    const member = mockUsers.find(u => u.id === payment.user_id);
                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium text-xs sm:text-sm">{payment.date}</TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{payment.time}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{member?.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-success/10 text-success border-success text-xs whitespace-nowrap">
                            ₹{payment.amount.toLocaleString('en-IN')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-muted-foreground hidden md:table-cell">{payment.recorded_by_name}</TableCell>
                        {(currentUser.role === 'admin' || currentUser.role === 'responsible_member') && (
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
