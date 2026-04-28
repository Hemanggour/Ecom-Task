import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  glass?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, hoverable = false, glass = false, className = '', ...props }, ref) => {
    const baseStyles = 'bg-bg-card border border-border rounded-xl p-6 transition-all duration-300';
    
    const hoverStyles = hoverable ? 'hover:-translate-y-1 hover:shadow-xl hover:border-primary' : '';
    const glassStyles = glass ? 'glass' : 'shadow-sm';

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${hoverStyles} ${glassStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
