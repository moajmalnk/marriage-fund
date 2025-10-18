import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockUsers, mockPayments } from '@/lib/mockData';
import { Plus, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Payments = () => {
  const { currentUser, isLoading } = useAuth();
  const [selectedMember, setSelectedMember] = useState('');
  const [amount, setAmount] = useState('');

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

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMember || !amount) {
      console.log("Error: Please fill in all fields");
      return;
    }

    console.log(`Payment Recorded: Payment of ₹${amount} recorded successfully`);

    // Reset form
    setSelectedMember('');
    setAmount('');
  };

  // Filter payments based on role
  const visiblePayments = currentUser.role === 'admin' 
    ? mockPayments 
    : currentUser.role === 'responsible_member'
    ? mockPayments.filter(p => {
        const user = mockUsers.find(u => u.id === p.user_id);
        return user?.responsible_member_id === currentUser.id || p.user_id === currentUser.id;
      })
    : mockPayments.filter(p => p.user_id === currentUser.id);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Payment Management</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Record and view payment history</p>
      </div>

      {/* Record Payment Form - Only for Admin and Responsible Members */}
      {(currentUser.role === 'admin' || currentUser.role === 'responsible_member') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Record New Payment
            </CardTitle>
            <CardDescription>
              {currentUser.role === 'admin' 
                ? 'Record payment for any member' 
                : 'Record payment for your assigned members'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="member" className="text-sm">Select Member</Label>
                  <Select value={selectedMember} onValueChange={setSelectedMember}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a member" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {availableMembers.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} (₹{member.assigned_monthly_amount})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full sm:w-auto">
                Record Payment
              </Button>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {visiblePayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-xs sm:text-sm text-muted-foreground">
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
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
