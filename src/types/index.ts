export type UserRole = 'admin' | 'responsible_member' | 'member';

export type MaritalStatus = 'Married' | 'Unmarried';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  marital_status: MaritalStatus;
  assigned_monthly_amount: number;
  responsible_member_id?: string;
  email?: string;
  phone?: string;
  profile_photo?: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  date: string;
  time: string;
  recorded_by: string;
  recorded_by_name: string;
  type: 'collect' | 'pay';
  notes?: string;
}

export interface FundRequest {
  id: string;
  user_id: string;
  user_name: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'declined';
  repayment_duration?: number;
  requested_date: string;
  reviewed_by?: string;
  reviewed_date?: string;
  payment_date?: string; // When payment is scheduled
  paid_amount?: number; // Amount already paid
  payment_status?: 'pending' | 'partial' | 'paid'; // Payment status
}

export interface TeamMember {
  responsible_member: User;
  members: User[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'payment' | 'wedding' | 'announcement';
  isRead: boolean;
  created_at: string;
  user_id?: string; // If notification is for specific user
  related_id?: string; // Related payment, fund request, etc.
  related_type?: 'payment' | 'fund_request' | 'wedding' | 'general';
  priority: 'low' | 'medium' | 'high';
}
