
import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/40 bg-white/80 backdrop-blur-lg">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="mr-2 rounded-md p-2 text-muted-foreground hover:bg-secondary transition-colors"
              aria-label="Toggle Menu"
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        <div className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search books, members..."
              className={cn(
                "w-full bg-secondary/50 border-0 rounded-full py-2 pl-10 pr-4",
                "focus-ring text-sm placeholder:text-muted-foreground"
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-full hover:bg-secondary transition-colors">
            <Bell size={20} className="text-muted-foreground" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
          </button>
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-xs font-medium">AA</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
