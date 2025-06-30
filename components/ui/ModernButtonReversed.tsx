import React from 'react';

interface ModernButtonReversedProps {
  text: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

const ModernButtonReversed: React.FC<ModernButtonReversedProps> = ({ 
  text, 
  onClick, 
  className = '', 
  type = 'button',
  icon
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex justify-center gap-2 items-center mx-auto shadow-xl bg-[var(--color-main)] backdrop-blur-md isolation-auto border-[var(--color-main)] hover:border-[var(--color-black)] before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-gray-50 hover:text-[var(--color-main)] before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group text-gray-50 ${className}`}
    >
      {text}
      {icon}
    </button>
  );
};

export default ModernButtonReversed; 