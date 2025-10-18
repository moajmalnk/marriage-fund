import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import DatePicker from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  date: string;
  time: string;
  recorded_by_name: string;
  notes?: string;
}

interface User {
  id: string;
  name: string;
  assigned_monthly_amount: number;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payment: Omit<Payment, 'id' | 'recorded_by_name'>) => void;
  onDelete?: (paymentId: string) => void;
  payment?: Payment | null;
  users: User[];
  currentUserName: string;
  mode: 'create' | 'edit' | 'delete';
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  payment,
  users,
  currentUserName,
  mode
}) => {
  const [formData, setFormData] = useState({
    user_id: '',
    amount: '',
    date: '',
    time: '',
    notes: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (payment && mode === 'edit') {
      setFormData({
        user_id: payment.user_id,
        amount: payment.amount.toString(),
        date: payment.date,
        time: payment.time,
        notes: payment.notes || ''
      });
    } else if (mode === 'create') {
      setFormData({
        user_id: '',
        amount: '',
        date: '',
        time: '',
        notes: ''
      });
    }
    setErrors({});
  }, [payment, mode, isOpen]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.user_id) {
      newErrors.user_id = 'Please select a member';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Please enter the payment amount';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.date) {
      newErrors.date = 'Please select the payment date';
    }
    
    if (!formData.time) {
      newErrors.time = 'Please enter the payment time';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'delete') {
      if (onDelete && payment) {
        setIsSubmitting(true);
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          onDelete(payment.id);
          onClose();
        } finally {
          setIsSubmitting(false);
        }
      }
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const paymentData = {
        user_id: formData.user_id,
        amount: parseFloat(formData.amount),
        date: formData.date,
        time: formData.time,
        notes: formData.notes
      };
      
      onSave(paymentData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  const selectedUser = users.find(u => u.id === formData.user_id);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl flex-shrink-0 ${
              mode === 'create' ? 'bg-green-500' : 
              mode === 'edit' ? 'bg-blue-500' : 'bg-red-500'
            } text-white shadow-lg`}>
              {mode === 'create' ? (
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : mode === 'edit' ? (
                <Save className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 truncate">
                {mode === 'create' ? 'Record New Payment' : 
                 mode === 'edit' ? 'Edit Payment' : 'Delete Payment'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">
                {mode === 'create' ? 'Add a new payment record to the system' :
                 mode === 'edit' ? 'Update payment information' :
                 'Are you sure you want to delete this payment?'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0 ml-2"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-140px)]">
          {mode === 'delete' ? (
            /* Delete Confirmation */
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      This action cannot be undone
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400">
                      The payment record will be permanently removed from the system.
                    </p>
                  </div>
                </div>
              </div>

              {payment && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Payment Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Member:</span>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {users.find(u => u.id === payment.user_id)?.name}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Amount:</span>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          ₹{payment.amount.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Date:</span>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {payment.date}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Time:</span>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {payment.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Create/Edit Form */
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Member Selection */}
              <div className="space-y-2 sm:space-y-3">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Select Member
                </Label>
                <Select 
                  value={formData.user_id} 
                  onValueChange={(value) => handleInputChange('user_id', value)}
                >
                  <SelectTrigger className={`h-10 sm:h-12 border-2 transition-all duration-200 ${
                    errors.user_id 
                      ? 'border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-400' 
                      : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400'
                  }`}>
                    <SelectValue placeholder="Choose a member" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id} className="py-2 sm:py-3">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium text-sm sm:text-base">{user.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            ₹{user.assigned_monthly_amount}/month
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.user_id && (
                  <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm">{errors.user_id}</p>
                )}
              </div>

              {/* Amount and Date Row */}
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                <div className="space-y-2 sm:space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Payment Amount
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base">
                      ₹
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      className={`h-10 sm:h-12 pl-8 sm:pl-10 pr-3 sm:pr-4 border-2 transition-all duration-200 text-sm sm:text-base ${
                        errors.amount 
                          ? 'border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-400' 
                          : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400'
                      }`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm">{errors.amount}</p>
                  )}
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Payment Date
                  </Label>
                  <DatePicker
                    value={formData.date}
                    onChange={(date) => handleInputChange('date', date)}
                    placeholder="Select payment date"
                    error={!!errors.date}
                    className="h-10 sm:h-12"
                  />
                  {errors.date && (
                    <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm">{errors.date}</p>
                  )}
                </div>
              </div>

              {/* Time */}
              <div className="space-y-2 sm:space-y-3">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Payment Time
                </Label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className={`h-10 sm:h-12 border-2 transition-all duration-200 text-sm sm:text-base ${
                    errors.time 
                      ? 'border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-400' 
                      : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400'
                  }`}
                />
                {errors.time && (
                  <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm">{errors.time}</p>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2 sm:space-y-3">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  placeholder="Add any additional information about this payment..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="min-h-[80px] sm:min-h-[100px] border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 resize-none text-sm sm:text-base"
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 sm:px-6 py-2 border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 text-sm sm:text-base"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 sm:px-6 py-2 text-white font-semibold transition-all duration-200 text-sm sm:text-base ${
              mode === 'create' 
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                : mode === 'edit'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="hidden sm:inline">
                  {mode === 'delete' ? 'Deleting...' : 'Saving...'}
                </span>
                <span className="sm:hidden">
                  {mode === 'delete' ? 'Deleting' : 'Saving'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                {mode === 'create' ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Record Payment</span>
                    <span className="sm:hidden">Record</span>
                  </>
                ) : mode === 'edit' ? (
                  <>
                    <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Update Payment</span>
                    <span className="sm:hidden">Update</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Delete Payment</span>
                    <span className="sm:hidden">Delete</span>
                  </>
                )}
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
