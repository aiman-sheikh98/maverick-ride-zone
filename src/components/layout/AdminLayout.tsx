
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AreaManager } from '@/components/admin/AreaManager';
import { ContactManager } from '@/components/admin/ContactManager';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X } from 'lucide-react';

interface AdminLayoutProps {
  children?: React.ReactNode;
  activeTab: 'dashboard' | 'areas' | 'contacts' | 'bookings';
}

export const AdminLayout = ({ children, activeTab }: AdminLayoutProps) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);
  
  const location = useLocation();

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when path changes on mobile
  React.useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Ensure sidebar is open on desktop
  React.useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  let content;
  switch (activeTab) {
    case 'areas':
      content = <AreaManager />;
      break;
    case 'contacts':
      content = <ContactManager />;
      break;
    default:
      content = children;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', key: 'dashboard' },
    { name: 'Service Areas', path: '/admin/areas', key: 'areas' },
    { name: 'Contacts', path: '/admin/contacts', key: 'contacts' },
    { name: 'Bookings', path: '/admin/bookings', key: 'bookings' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <Link to="/" className="text-lg font-bold gradient-text">
              Maverick Admin
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                Exit Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-14">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed z-20 h-full bg-sidebar pt-6 border-r border-border transition-all duration-300 ease-in-out",
            sidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"
          )}
        >
          <nav className="space-y-1 px-4">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md",
                  activeTab === item.key
                    ? "bg-maverick-100 text-maverick-700"
                    : "text-gray-700 hover:bg-maverick-50 hover:text-maverick-600"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out",
            sidebarOpen ? "md:ml-64" : "ml-0"
          )}
        >
          <div className="container px-4 py-6 md:py-10 max-w-7xl">
            {content}
          </div>
        </main>
      </div>
    </div>
  );
};
