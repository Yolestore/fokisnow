import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LayoutDashboard, FileText, Image, MessageSquare, LogOut } from "lucide-react";
import type { User } from "@shared/schema";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/user'],
    retry: false,
    onError: () => {
      setLocation('/login');
    }
  });

  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      setLocation('/login');
    }
  }, [user, isLoading, setLocation]);

  if (isLoading || !user?.isAdmin) {
    return null;
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: FileText, label: "Posts", href: "/admin/posts" },
    { icon: Image, label: "Media", href: "/admin/media" },
    { icon: MessageSquare, label: "Comments", href: "/admin/comments" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col fixed w-64 h-screen border-r bg-card">
        <div className="p-6">
          <img
            src="/logo-light.svg"
            alt="FOKIS NOW Admin"
            className="h-8 dark:hidden"
          />
          <img
            src="/logo-dark.svg"
            alt="FOKIS NOW Admin"
            className="h-8 hidden dark:block"
          />
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setLocation(item.href)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive"
            onClick={() => {
              // Handle logout
              setLocation('/auth');
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden border-b">
        <div className="flex items-center justify-between p-4">
          <img
            src="/logo-light.svg"
            alt="FOKIS NOW Admin"
            className="h-8 dark:hidden"
          />
          <img
            src="/logo-dark.svg"
            alt="FOKIS NOW Admin"
            className="h-8 hidden dark:block"
          />
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="space-y-4 py-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setLocation(item.href)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  );
                })}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive"
                  onClick={() => {
                    // Handle logout
                    setLocation('/auth');
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
