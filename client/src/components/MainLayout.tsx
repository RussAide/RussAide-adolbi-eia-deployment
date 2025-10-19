import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import {
  Home,
  Users,
  FileText,
  AlertCircle,
  DollarSign,
  BarChart3,
  UserCircle,
  LogOut,
  Menu,
  X,
  UserCog,
  Briefcase,
  ClipboardList,
  Shield,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import EIABot from "./EIABot";
import { Link, useLocation } from "wouter";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    window.location.href = getLoginUrl();
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: Home, color: "bg-blue-600 hover:bg-blue-700" },
    { name: "Clients", path: "/clients", icon: Users, color: "bg-green-600 hover:bg-green-700" },
    { name: "Referrals", path: "/referrals", icon: ClipboardList, color: "bg-pink-600 hover:bg-pink-700" },
    { name: "Crisis", path: "/crisis", icon: AlertCircle, color: "bg-red-600 hover:bg-red-700" },
    { name: "Services", path: "/services", icon: Briefcase, color: "bg-cyan-600 hover:bg-cyan-700" },
    { name: "Staff", path: "/staff", icon: UserCog, color: "bg-teal-600 hover:bg-teal-700" },
    { name: "Documentation", path: "/documentation", icon: FileText, color: "bg-purple-600 hover:bg-purple-700" },
    { name: "SOP Chapters", path: "/sop-chapters", icon: BookOpen, color: "bg-violet-600 hover:bg-violet-700" },
    { name: "Billing", path: "/billing", icon: DollarSign, color: "bg-orange-600 hover:bg-orange-700" },
    { name: "Compliance", path: "/compliance", icon: Shield, color: "bg-slate-600 hover:bg-slate-700" },
    { name: "Reports", path: "/reports", icon: BarChart3, color: "bg-indigo-600 hover:bg-indigo-700" },
  ];

  if (loading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
        <EIABot />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <div className="text-center mb-6">
            <img 
              src="/adolbi-logo.png?v=2" 
              alt="Adolbi Care" 
              className="h-24 mx-auto mb-4" 
              style={{ maxHeight: '96px', width: 'auto', display: 'block' }}
            />
            <p className="text-gray-600 text-lg">Integrated Behavioral Health Platform</p>
          </div>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="w-full"
            size="lg"
          >
            Sign In
          </Button>
        </div>      </div>
    );
  }
  return (
    <>
      <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <a className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <img 
                  src="/adolbi-logo.png?v=2" 
                  alt="Adolbi Care" 
                  className="h-12 w-auto" 
                  style={{ maxHeight: '48px', width: 'auto', display: 'block' }}
                  onError={(e) => { console.error('Logo failed to load'); e.currentTarget.style.display = 'none'; }}
                />
              </a>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path}>
                    <a>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={isActive ? item.color : ""}
                        size="sm"
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.name}
                      </Button>
                    </a>
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:flex">
                    <UserCircle className="w-5 h-5 mr-2" />
                    <span className="max-w-[150px] truncate">{user?.name || user?.email || "User"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <p className="text-xs text-muted-foreground capitalize">Role: {user?.role}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <a className="block">
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          className={`${isActive ? item.color : ""} w-full justify-start`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {item.name}
                        </Button>
                      </a>
                    </Link>
                  );
                })}
                <DropdownMenuSeparator />
                <div className="px-2 py-2">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <Button variant="ghost" className="justify-start" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>© 2025 Adolbi Care. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Integrated Behavioral Health Platform</p>
          </div>
        </div>
      </footer>
      </div>
      <EIABot />
    </>
  );
}

