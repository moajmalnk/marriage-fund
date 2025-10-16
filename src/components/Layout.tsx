import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LayoutDashboard, CreditCard, Users, FileText, LogOut, UserCircle, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-primary">CBMS Fund</h2>
          <ThemeToggle />
        </div>
        <p className="text-sm text-muted-foreground mt-1">Marriage Support</p>
      </div>

      <nav className="px-3 py-4 flex-1">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
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
          <p className="text-sm font-medium truncate">{currentUser.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{currentUser.role.replace('_', ' ')}</p>
        </div>
        <div className="space-y-2">
          <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
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
    </>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 w-full border-b bg-card">
        <div className="flex h-16 items-center justify-between px-4">
          <div>
            <h2 className="text-lg font-bold text-primary">CBMS Fund</h2>
            <p className="text-xs text-muted-foreground">Marriage Support</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 flex flex-col">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-card border-r">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
