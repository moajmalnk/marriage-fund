import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  FileText, 
  LogOut, 
  UserCircle, 
  Menu,
  Heart,
  Settings,
  Sparkles,
  Shield,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { currentUser, logout, isLoading } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-hidden">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const adminNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'text-blue-600' },
    { name: 'Payments', href: '/payments', icon: CreditCard, color: 'text-green-600' },
    { name: 'Team', href: '/team', icon: Users, color: 'text-purple-600' },
    { name: 'Fund Requests', href: '/fund-requests', icon: Heart, color: 'text-red-600' },
    { name: 'Manage Users', href: '/manage-users', icon: Settings, color: 'text-orange-600' },
  ];

  const navigation = currentUser.role === 'admin' ? adminNavigation : [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'text-blue-600' },
    { name: 'Payments', href: '/payments', icon: CreditCard, color: 'text-green-600' },
    { name: 'Team', href: '/team', icon: Users, color: 'text-purple-600' },
    { name: 'Fund Requests', href: '/fund-requests', icon: Heart, color: 'text-red-600' },
  ];

  const SidebarContent = () => (
    <>
      {/* Header Card */}
      <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-blue-500/25">
                <Shield className="h-5 w-5" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
            </div>
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                CBMS Fund
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Marriage Support System
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation Cards */}
      <nav className="px-4 py-6 flex-1 space-y-3 overflow-y-auto">
        {navigation.map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <div
              key={item.name}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Link
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 ease-out",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/25 border border-blue-400/20"
                    : "bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-xl transition-all duration-300",
                  isActive 
                    ? "bg-white/20" 
                    : "bg-slate-100/80 dark:bg-slate-700/80 group-hover:bg-slate-200/80 dark:group-hover:bg-slate-600/80"
                )}>
                  <item.icon className={cn(
                    "h-4 w-4 transition-all duration-300",
                    isActive ? "text-white" : item.color
                  )} />
                </div>
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <div className="ml-auto flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <Sparkles className="h-3 w-3 text-white/80" />
                  </div>
                )}
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-600/10 animate-pulse" />
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* User Profile Card */}
      <div className="p-2 sm:p-3 lg:p-4 border-t border-slate-200/60 dark:border-slate-700/60 mt-auto">
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white dark:border-slate-800" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Link 
                  to="/profile" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 min-w-0 cursor-pointer group"
                >
                  <p className="text-xs sm:text-sm font-semibold truncate text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize font-medium group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200 truncate">
                    {currentUser.role.replace('_', ' ')}
                  </p>
                </Link>
                <button
                  onClick={logout}
                  className="flex-shrink-0 p-1 sm:p-1.5 rounded-md hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30 dark:hover:text-red-300 transition-all duration-200"
                  aria-label="Logout"
                >
                  <LogOut className="text-slate-500 dark:text-slate-400 ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white shadow-lg">
                <Shield className="h-4 w-4" />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border border-white dark:border-slate-900 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                CBMS Fund
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Marriage Support</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isMobile && (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="left" 
                  className="w-80 p-0 flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-700/60 z-[60]"
                >
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Main navigation menu with links to different sections of the application.
                  </SheetDescription>
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-700/60 shadow-xl sticky top-0 h-screen overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-auto transition-all duration-300 ease-in-out h-full",
        isMobile ? "pt-0" : "pt-0"
      )}>
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
