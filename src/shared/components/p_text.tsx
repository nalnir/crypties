import React, { ReactNode } from 'react';

interface PTextProps {
  children?: ReactNode;
  className?: string;
}

export const PText: React.FC<PTextProps> = ({ children, className }) => {
  return <p className={`${className} `}>{children}</p>
};