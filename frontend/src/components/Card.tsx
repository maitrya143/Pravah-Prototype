import React from 'react';

interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  hover = false,
  className = '',
}) => {
  return (
    <div className={`${hover ? 'card-hover' : 'card'} ${className}`}>
      {children}
    </div>
  );
};

