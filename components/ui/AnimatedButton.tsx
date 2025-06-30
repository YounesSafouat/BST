import React from 'react';
import styles from './AnimatedButton.module.css';

interface AnimatedButtonProps {
  text: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ text, icon, onClick, className = '', type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.animatedButton} ${className}`}
    >
      {/* Left Icon */}
      <span className={styles.iconLeft} aria-hidden="true">
        {icon}
      </span>
      {/* Text */}
      <span className={styles.text}>{text}</span>
    </button>
  );
};

export default AnimatedButton; 