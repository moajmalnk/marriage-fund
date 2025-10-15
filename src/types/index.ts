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
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  date: string;
  time: string;
  recorded_by: string;
  recorded_by_name: string;
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
}

export interface TeamMember {
  responsible_member: User;
  members: User[];
}
