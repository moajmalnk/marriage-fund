import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockFundRequests } from '@/lib/mockData';
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

const FundRequests = () => {
  const { currentUser, isLoading } = useAuth();
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) return null;

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !reason) {
      console.log("Error: Please fill in all fields");
      return;
    }

    console.log("Request Submitted: Your fund request has been submitted for review");

    setAmount('');
    setReason('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-success text-success-foreground hover:bg-success/90">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        );
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

  // Filter requests based on role
  const visibleRequests = currentUser.role === 'admin'
    ? mockFundRequests
    : mockFundRequests.filter(r => r.user_id === currentUser.id);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fund Requests</h1>
        <p className="text-muted-foreground">Request and manage fund disbursements</p>
      </div>

      {/* Submit Request Form - Only for Members */}
      {currentUser.role === 'member' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Submit New Request
            </CardTitle>
            <CardDescription>Request fund support from CBMS</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Requested Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Explain why you need this fund"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full md:w-auto">
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentUser.role === 'admin' ? 'All Fund Requests' : 'My Fund Requests'}
          </CardTitle>
          <CardDescription>
            {currentUser.role === 'admin' 
              ? 'Review and approve fund requests from members'
              : 'Track your fund request status'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  {currentUser.role === 'admin' && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={currentUser.role === 'admin' ? 6 : 5} className="text-center py-8 text-muted-foreground">
                      No fund requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleRequests.map(request => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.user_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                          ₹{request.amount.toLocaleString('en-IN')}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                      <TableCell>{request.requested_date}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      {currentUser.role === 'admin' && (
                        <TableCell>
                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-success hover:bg-success/90">
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive">
                                Decline
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FundRequests;
