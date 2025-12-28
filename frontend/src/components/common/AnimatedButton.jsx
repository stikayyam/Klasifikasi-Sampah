import React from 'react';
import { motion } from 'framer-motion';

const AnimatedButton = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  icon: Icon,
  ...props
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    ghost: 'bg-transparent border border-white/20 text-white hover:bg-white/10',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
  };

  const sizes = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
    xl: 'py-5 px-10 text-xl'
  };

  const buttonVariants = {
    initial: { scale: 1, opacity: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
    disabled: { scale: 1, opacity: 0.5 }
  };

  const MotionButton = motion.button;

  return (
    <MotionButton
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-xl font-semibold
        flex items-center justify-center gap-2
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-darker
        disabled:cursor-not-allowed
        ${className}
      `}
      variants={buttonVariants}
      initial="initial"
      whileHover={!disabled ? "hover" : "disabled"}
      whileTap={!disabled ? "tap" : "disabled"}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </MotionButton>
  );
};

export default AnimatedButton;