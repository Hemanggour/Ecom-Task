import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-primary/10 text-primary border border-primary/20',
      secondary: 'bg-secondary/10 text-secondary border border-secondary/20',
      success: 'bg-success/10 text-success border border-success/20',
      warning: 'bg-warning/10 text-warning border border-warning/20',
      danger: 'bg-danger/10 text-danger border border-danger/20',
    };

    const sizeStyles = {
      sm: 'px-2 py-1 text-xs font-semibold',
      md: 'px-3 py-1.5 text-sm font-semibold',
      lg: 'px-4 py-2 text-base font-semibold',
    };

    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-2 rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
