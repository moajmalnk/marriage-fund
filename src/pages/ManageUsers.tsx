import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { mockUsers } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { UserRole, MaritalStatus } from '@/types';

const ManageUsers = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    role: 'member' as UserRole,
    marital_status: 'Unmarried' as MaritalStatus,
    assigned_monthly_amount: '',
    responsible_member_id: '',
  });

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      toast({
        title: "User Updated",
        description: `${formData.name} has been updated successfully`,
      });
    } else {
      toast({
        title: "User Created",
        description: `${formData.name} has been added successfully`,
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      setFormData({
        username: user.username,
        name: user.name,
        role: user.role,
        marital_status: user.marital_status,
        assigned_monthly_amount: user.assigned_monthly_amount.toString(),
        responsible_member_id: user.responsible_member_id || '',
      });
      setEditingUser(userId);
      setIsDialogOpen(true);
    }
  };

  const handleDelete = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    toast({
      title: "User Deleted",
      description: `${user?.name} has been removed`,
      variant: "destructive",
    });
  };

  const resetForm = () => {
    setFormData({
      username: '',
      name: '',
      role: 'member',
      marital_status: 'Unmarried',
      assigned_monthly_amount: '',
      responsible_member_id: '',
    });
    setEditingUser(null);
  };

  const responsibleMembers = mockUsers.filter(u => u.role === 'responsible_member');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
          <p className="text-muted-foreground">Create, edit, and manage all users</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
              <DialogDescription>
                {editingUser ? 'Update user information' : 'Add a new user to the system'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="responsible_member">Responsible Member</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marital_status">Marital Status</Label>
                  <Select value={formData.marital_status} onValueChange={(value: MaritalStatus) => setFormData({ ...formData, marital_status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Unmarried">Unmarried</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Monthly Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.assigned_monthly_amount}
                    onChange={(e) => setFormData({ ...formData, assigned_monthly_amount: e.target.value })}
                    required
                  />
                </div>
                {formData.role === 'member' && (
                  <div className="space-y-2">
                    <Label htmlFor="responsible">Responsible Member</Label>
                    <Select value={formData.responsible_member_id} onValueChange={(value) => setFormData({ ...formData, responsible_member_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select leader" />
                      </SelectTrigger>
                      <SelectContent>
                        {responsibleMembers.map(member => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingUser ? 'Update User' : 'Create User'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Users
          </CardTitle>
          <CardDescription>Manage all members, leaders, and admins</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Marital Status</TableHead>
                  <TableHead>Monthly Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={user.marital_status === 'Married' ? 'bg-success/10 text-success border-success' : ''}
                      >
                        {user.marital_status}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{user.assigned_monthly_amount.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(user.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageUsers;
