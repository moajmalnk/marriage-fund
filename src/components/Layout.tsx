import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, CreditCard, Users, FileText, LogOut, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const adminNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Payments', href: '/payments', icon: CreditCard },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Fund Requests', href: '/fund-requests', icon: FileText },
    { name: 'Manage Users', href: '/manage-users', icon: Users },
  ];

  const navigation = currentUser.role === 'admin' ? adminNavigation : [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Payments', href: '/payments', icon: CreditCard },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Fund Requests', href: '/fund-requests', icon: FileText },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r">
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary">CBMS Fund</h2>
          <p className="text-sm text-muted-foreground mt-1">Marriage Support</p>
        </div>

        <nav className="px-3 pb-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t mt-auto">
          <div className="mb-3 px-2">
            <p className="text-sm font-medium">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{currentUser.role.replace('_', ' ')}</p>
          </div>
          <div className="space-y-2">
            <Link to="/profile">
              <Button
                variant="outline"
                className="w-full justify-start"
              >
                <UserCircle className="mr-2 h-4 w-4" />
                My Profile
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
