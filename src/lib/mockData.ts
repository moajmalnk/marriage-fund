import { User, Payment, FundRequest, TeamMember, Notification } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  // Responsible Members (Leaders)
  { id: '1', username: 'ameen', name: 'Ameen', role: 'responsible_member', marital_status: 'Married', assigned_monthly_amount: 700000 },
  { id: '2', username: 'sabeeh', name: 'Sabeeh', role: 'responsible_member', marital_status: 'Married', assigned_monthly_amount: 700000  },
  { id: '3', username: 'ajmal_nk', name: 'Ajmal NK', role: 'responsible_member', marital_status: 'Unmarried', assigned_monthly_amount: 450000 },
  { id: '4', username: 'shakir_kk', name: 'Shakir KK', role: 'responsible_member', marital_status: 'Married', assigned_monthly_amount: 700000 },
  { id: '5', username: 'fawaz', name: 'Fawaz', role: 'responsible_member', marital_status: 'Unmarried', assigned_monthly_amount: 450000 },
  { id: '6', username: 'basil', name: 'Basil', role: 'responsible_member', marital_status: 'Married', assigned_monthly_amount: 70000 },
  { id: '7', username: 'mubashir', name: 'Mubashir', role: 'responsible_member', marital_status: 'Unmarried', assigned_monthly_amount: 45000 },
  
  // Members under Ameen
  { id: '11', username: 'jamal', name: 'Jamal', role: 'member', marital_status: 'Unmarried', assigned_monthly_amount: 45000, responsible_member_id: '1' },
  { id: '12', username: 'navas', name: 'Navas', role: 'member', marital_status: 'Married', assigned_monthly_amount: 70000, responsible_member_id: '1' },
  
  // Members under Sabeeh
  { id: '13', username: 'ajmal_p', name: 'Ajmal P', role: 'member', marital_status: 'Married', assigned_monthly_amount: 70000, responsible_member_id: '2' },
  { id: '14', username: 'saheer', name: 'Saheer', role: 'member', marital_status: 'Unmarried', assigned_monthly_amount: 45000, responsible_member_id: '2' },
  
  // Members under Ajmal NK
  { id: '15', username: 'ashif', name: 'Ashif', role: 'member', marital_status: 'Married', assigned_monthly_amount: 70000, responsible_member_id: '3' },
  { id: '16', username: 'isham', name: 'Isham', role: 'member', marital_status: 'Unmarried', assigned_monthly_amount: 45000, responsible_member_id: '3' },
  
  // Members under Shakir KK
  { id: '17', username: 'shareef', name: 'Shareef', role: 'member', marital_status: 'Married', assigned_monthly_amount: 70000, responsible_member_id: '4' },
  { id: '18', username: 'junaid', name: 'Junaid', role: 'member', marital_status: 'Unmarried', assigned_monthly_amount: 45000, responsible_member_id: '4' },
  
  // Members under Fawaz
  { id: '19', username: 'adhil_kp', name: 'Adhil KP', role: 'member', marital_status: 'Married', assigned_monthly_amount: 700000, responsible_member_id: '5' },
  { id: '20', username: 'muzammil', name: 'Muzammil', role: 'member', marital_status: 'Unmarried', assigned_monthly_amount: 45000, responsible_member_id: '5' },
  
  // Members under Basil
  { id: '21', username: 'ali', name: 'Ali', role: 'member', marital_status: 'Married', assigned_monthly_amount: 70000, responsible_member_id: '6' },
  { id: '22', username: 'ashmal', name: 'Ashmal', role: 'member', marital_status: 'Unmarried', assigned_monthly_amount: 45000, responsible_member_id: '6' },
  
  // Members under Mubashir
  { id: '23', username: 'muhsin', name: 'Muhsin', role: 'member', marital_status: 'Married', assigned_monthly_amount: 70000, responsible_member_id: '7' },
  { id: '24', username: 'adhil_a', name: 'Adhil A', role: 'member', marital_status: 'Unmarried', assigned_monthly_amount: 45000, responsible_member_id: '7' },
  { id: '25', username: 'salman', name: 'Salman', role: 'member', marital_status: 'Married', assigned_monthly_amount: 70000, responsible_member_id: '7' },
  
  // Admin
  { id: '99', username: 'admin', name: 'Administrator', role: 'admin', marital_status: 'Married', assigned_monthly_amount: 0 },
];

// Mock Payments
export const mockPayments: Payment[] = [
  { id: 'p1', user_id: '11', amount: 45000, date: '2025-01-15', time: '10:30 AM', recorded_by: '1', recorded_by_name: 'Ameen', type: 'collect', notes: 'Monthly contribution' },
  { id: 'p2', user_id: '12', amount: 70000, date: '2025-01-16', time: '02:15 PM', recorded_by: '1', recorded_by_name: 'Ameen', type: 'collect', notes: 'Monthly contribution' },
  { id: 'p3', user_id: '13', amount: 70000, date: '2025-01-14', time: '11:45 AM', recorded_by: '2', recorded_by_name: 'Sabeeh', type: 'collect', notes: 'Monthly contribution' },
  { id: 'p4', user_id: '15', amount: 70000, date: '2025-01-17', time: '09:00 AM', recorded_by: '3', recorded_by_name: 'Ajmal NK', type: 'collect', notes: 'Monthly contribution' },
  { id: 'p5', user_id: '17', amount: 70000, date: '2025-01-18', time: '03:30 PM', recorded_by: '4', recorded_by_name: 'Shakir KK', type: 'collect', notes: 'Monthly contribution' },
  { id: 'p6', user_id: '19', amount: 70000, date: '2025-01-19', time: '01:20 PM', recorded_by: '5', recorded_by_name: 'Fawaz', type: 'collect', notes: 'Monthly contribution' },
  { id: 'p7', user_id: '21', amount: 70000, date: '2025-01-20', time: '10:00 AM', recorded_by: '6', recorded_by_name: 'Basil', type: 'collect', notes: 'Monthly contribution' },
  { id: 'p8', user_id: '23', amount: 70000, date: '2025-01-21', time: '04:45 PM', recorded_by: '7', recorded_by_name: 'Mubashir', type: 'collect', notes: 'Monthly contribution' },
  { id: 'p9', user_id: '25', amount: 70000, date: '2025-01-22', time: '02:30 PM', recorded_by: '7', recorded_by_name: 'Mubashir', type: 'collect', notes: 'Monthly contribution' },
  // Sample disbursements
  { id: 'p10', user_id: '11', amount: 120000, date: '2025-01-25', time: '11:00 AM', recorded_by: '99', recorded_by_name: 'Administrator', type: 'pay', notes: 'Marriage fund disbursement - approved request' },
  { id: 'p11', user_id: '13', amount: 60000, date: '2025-01-26', time: '02:00 PM', recorded_by: '99', recorded_by_name: 'Administrator', type: 'pay', notes: 'Partial marriage fund disbursement' },
];

// Mock Fund Requests
export const mockFundRequests: FundRequest[] = [
  {
    id: 'fr1',
    user_id: '11',
    user_name: 'Jamal',
    amount: 120000,
    reason: 'Marriage expenses',
    status: 'approved',
    repayment_duration: 45,
    requested_date: '2025-01-10',
    reviewed_by: 'Administrator',
    reviewed_date: '2025-01-12',
    payment_date: '2025-02-26', // 45 days after approval
    paid_amount: 120000, // Fully paid
    payment_status: 'paid'
  },
  {
    id: 'fr2',
    user_id: '13',
    user_name: 'Ajmal P',
    amount: 120000,
    reason: 'Marriage expenses',
    status: 'approved',
    repayment_duration: 45,
    requested_date: '2025-01-15',
    reviewed_by: 'Administrator',
    reviewed_date: '2025-01-16',
    payment_date: '2025-03-02', // 45 days after approval
    paid_amount: 60000, // Partially paid
    payment_status: 'partial'
  },
  {
    id: 'fr3',
    user_id: '17',
    user_name: 'Shareef',
    amount: 120000,
    reason: 'Marriage expenses',
    status: 'approved',
    repayment_duration: 45,
    requested_date: '2025-01-18',
    reviewed_by: 'Administrator',
    reviewed_date: '2025-01-19',
    payment_date: '2025-03-05', // 45 days after approval
    paid_amount: 0, // Not paid yet
    payment_status: 'pending'
  },
  {
    id: 'fr4',
    user_id: '14',
    user_name: 'Saheer',
    amount: 120000,
    reason: 'Marriage expenses',
    status: 'pending',
    requested_date: '2025-01-20'
  },
  {
    id: 'fr5',
    user_id: '16',
    user_name: 'Isham',
    amount: 120000,
    reason: 'Marriage expenses',
    status: 'declined',
    requested_date: '2025-01-15',
    reviewed_by: 'Administrator',
    reviewed_date: '2025-01-16'
  }
];

// Team Structure
export const getTeamStructure = (): TeamMember[] => {
  return [
    {
      responsible_member: mockUsers.find(u => u.id === '1')!,
      members: mockUsers.filter(u => u.responsible_member_id === '1')
    },
    {
      responsible_member: mockUsers.find(u => u.id === '2')!,
      members: mockUsers.filter(u => u.responsible_member_id === '2')
    },
    {
      responsible_member: mockUsers.find(u => u.id === '3')!,
      members: mockUsers.filter(u => u.responsible_member_id === '3')
    },
    {
      responsible_member: mockUsers.find(u => u.id === '4')!,
      members: mockUsers.filter(u => u.responsible_member_id === '4')
    },
    {
      responsible_member: mockUsers.find(u => u.id === '5')!,
      members: mockUsers.filter(u => u.responsible_member_id === '5')
    },
    {
      responsible_member: mockUsers.find(u => u.id === '6')!,
      members: mockUsers.filter(u => u.responsible_member_id === '6')
    },
    {
      responsible_member: mockUsers.find(u => u.id === '7')!,
      members: mockUsers.filter(u => u.responsible_member_id === '7')
    }
  ];
};

// Helper functions
export const getTotalFundBalance = () => {
  const totalCollected = mockPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalDisbursed = mockFundRequests
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.amount, 0);
  return totalCollected - totalDisbursed;
};

export const getTotalCollected = () => {
  return mockPayments.reduce((sum, p) => sum + p.amount, 0);
};

export const getTotalDisbursed = () => {
  return mockFundRequests
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.amount, 0);
};

export const getTotalSpent = () => {
  return mockFundRequests
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.amount, 0);
};

export const getMaritalStatusCount = () => {
  const married = mockUsers.filter(u => u.marital_status === 'Married' && u.role !== 'admin').length;
  const unmarried = mockUsers.filter(u => u.marital_status === 'Unmarried' && u.role !== 'admin').length;
  return { married, unmarried };
};

export const getUserPayments = (userId: string) => {
  return mockPayments.filter(p => p.user_id === userId);
};

export const hasUserPaidThisMonth = (userId: string) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return mockPayments.some(p => {
    if (p.user_id !== userId) return false;
    const paymentDate = new Date(p.date);
    return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
  });
};

export const getUserTotalContributed = (userId: string) => {
  return mockPayments
    .filter(p => p.user_id === userId)
    .reduce((sum, p) => sum + p.amount, 0);
};

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Payment Received',
    message: 'Jamal has successfully paid ₹45,000 for this month\'s contribution.',
    type: 'success',
    isRead: false,
    created_at: '2025-01-25T10:30:00Z',
    related_id: 'p1',
    related_type: 'payment',
    priority: 'medium'
  },
  {
    id: 'n2',
    title: 'Fund Request Approved',
    message: 'Ajmal P\'s marriage fund request of ₹1,20,000 has been approved.',
    type: 'success',
    isRead: false,
    created_at: '2025-01-24T14:15:00Z',
    related_id: 'fr2',
    related_type: 'fund_request',
    priority: 'high'
  },
  {
    id: 'n3',
    title: 'Wedding Announcement',
    message: 'Shakir Jamal\'s wedding is scheduled for November 23, 2025. Please prepare your contributions.',
    type: 'wedding',
    isRead: true,
    created_at: '2025-09-23T09:00:00Z',
    related_id: 'fr3',
    related_type: 'wedding',
    priority: 'high'
  },
  {
    id: 'n4',
    title: 'Payment Reminder',
    message: 'Reminder: Monthly contributions are due by the end of this month.',
    type: 'warning',
    isRead: true,
    created_at: '2025-01-22T16:45:00Z',
    priority: 'medium'
  },
  {
    id: 'n5',
    title: 'System Update',
    message: 'The CBMS Marriage Fund system has been updated with new features.',
    type: 'info',
    isRead: true,
    created_at: '2025-01-21T11:20:00Z',
    priority: 'low'
  },
  {
    id: 'n6',
    title: 'Fund Request Pending',
    message: 'Saheer has submitted a new fund request for ₹1,20,000. Please review.',
    type: 'info',
    isRead: false,
    created_at: '2025-01-20T13:30:00Z',
    related_id: 'fr4',
    related_type: 'fund_request',
    priority: 'high'
  },
  {
    id: 'n7',
    title: 'Payment Overdue',
    message: 'Isham\'s payment is overdue. Please follow up for collection.',
    type: 'error',
    isRead: false,
    created_at: '2025-01-19T08:15:00Z',
    priority: 'high'
  },
  {
    id: 'n8',
    title: 'Monthly Report',
    message: 'January 2025 monthly report is now available. Total collected: ₹5,25,000',
    type: 'announcement',
    isRead: true,
    created_at: '2025-01-18T17:00:00Z',
    priority: 'medium'
  },
  {
    id: 'n9',
    title: 'New Member Added',
    message: 'A new member has been added to the fund. Welcome to the CBMS Marriage Fund family!',
    type: 'info',
    isRead: true,
    created_at: '2025-01-17T12:00:00Z',
    priority: 'low'
  },
  {
    id: 'n10',
    title: 'Fund Disbursement',
    message: 'Marriage fund of ₹1,20,000 has been disbursed to Jamal for his wedding expenses.',
    type: 'payment',
    isRead: false,
    created_at: '2025-01-16T15:30:00Z',
    related_id: 'p10',
    related_type: 'payment',
    priority: 'high'
  }
];

// Helper functions for notifications
export const getUnreadNotificationsCount = () => {
  return mockNotifications.filter(n => !n.isRead).length;
};

export const getNotificationsByType = (type: Notification['type']) => {
  return mockNotifications.filter(n => n.type === type);
};

export const getNotificationsByPriority = (priority: Notification['priority']) => {
  return mockNotifications.filter(n => n.priority === priority);
};

export const markNotificationAsRead = (notificationId: string) => {
  const notification = mockNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.isRead = true;
  }
};

export const markAllNotificationsAsRead = () => {
  mockNotifications.forEach(n => n.isRead = true);
};
