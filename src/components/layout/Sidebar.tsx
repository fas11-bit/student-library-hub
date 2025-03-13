
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Book, Users, Home, ArrowRightLeft, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Close sidebar on location change if mobile
  useEffect(() => {
    if (isMobile) {
      onClose();
    }
  }, [location.pathname, isMobile, onClose]);

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && open && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all-300 animate-fade-in" 
          onClick={onClose}
        />
      )}
      
      <aside 
        className={cn(
          "fixed top-0 left-0 h-full z-50",
          "bg-white shadow-glass border-r border-border/40",
          "w-64 flex flex-col transition-all duration-300 ease-in-out",
          isMobile && !open && "-translate-x-full",
          isMobile && open && "translate-x-0",
          !isMobile && !open && "-translate-x-full",
          !isMobile && open && "translate-x-0",
          isMobile ? "absolute" : "relative"
        )}
      >
        <div className="p-6">
          <h1 className="text-2xl font-medium tracking-tight">
            <span className="text-primary">Library</span> Hub
          </h1>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1.5">
          <NavItem to="/" label="Dashboard" icon={<Home size={18} />} active={location.pathname === '/'} />
          <NavItem to="/books" label="Books" icon={<Book size={18} />} active={location.pathname.startsWith('/books')} />
          <NavItem to="/members" label="Members" icon={<Users size={18} />} active={location.pathname.startsWith('/members')} />
          <NavItem to="/issue-return" label="Issue / Return" icon={<ArrowRightLeft size={18} />} active={location.pathname === '/issue-return'} />
        </nav>
        
        <div className="p-4 border-t border-border/40">
          <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon, active }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-all-200",
        "hover:bg-secondary",
        active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default Sidebar;
