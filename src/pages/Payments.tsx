import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockUsers, mockPayments } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { Plus, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Payments = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [selectedMember, setSelectedMember] = useState('');
  const [amount, setAmount] = useState('');

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
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Payment Recorded",
      description: `Payment of ₹${amount} recorded successfully`,
    });

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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment Management</h1>
        <p className="text-muted-foreground">Record and view payment history</p>
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
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="member">Select Member</Label>
                  <Select value={selectedMember} onValueChange={setSelectedMember}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a member" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMembers.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} (₹{member.assigned_monthly_amount})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full md:w-auto">
                Record Payment
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Payment History
          </CardTitle>
          <CardDescription>Complete transaction log with timestamps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Recorded By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visiblePayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No payment records found
                    </TableCell>
                  </TableRow>
                ) : (
                  visiblePayments.map(payment => {
                    const member = mockUsers.find(u => u.id === payment.user_id);
                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.date}</TableCell>
                        <TableCell>{payment.time}</TableCell>
                        <TableCell>{member?.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-success/10 text-success border-success">
                            ₹{payment.amount.toLocaleString('en-IN')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{payment.recorded_by_name}</TableCell>
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
