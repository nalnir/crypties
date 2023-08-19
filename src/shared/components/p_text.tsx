import React, { ReactNode } from 'react';
import { WithOnClickOptional } from '../interfaces';

interface PTextProps extends WithOnClickOptional {
  children?: ReactNode;
  className?: string;
}

export const PText: React.FC<PTextProps> = ({ children, className, onClick }) => {
  return <p onClick={onClick} className={`${className} `}>{children}</p>
};