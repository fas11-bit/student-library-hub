
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'amber' | 'rose';
  trend?: {
    value: number;
    up: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  color = 'blue',
  trend,
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      icon: 'text-blue-500',
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      icon: 'text-green-500',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      icon: 'text-amber-500',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      icon: 'text-rose-500',
    },
  };

  return (
    <div className="glass-effect rounded-xl p-6 flex flex-col transition-all duration-300 hover:translate-y-[-2px]">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="mt-1 flex items-baseline gap-1">
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
            {trend && (
              <span className={cn(
                "flex items-center text-xs font-medium",
                trend.up ? "text-green-600" : "text-rose-600"
              )}>
                {trend.up ? "▲" : "▼"} {trend.value}%
              </span>
            )}
          </div>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
        <div className={cn("p-3 rounded-full", colorClasses[color].bg)}>
          <Icon size={18} className={colorClasses[color].icon} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
