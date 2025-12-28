import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ 
  type = 'card', 
  className = '', 
  lines = 3,
  height = 'h-4',
  width = 'w-full'
}) => {
  const skeletonVariants = {
    card: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3 }
    },
    line: {
      initial: { width: '0%' },
      animate: { width: '100%' },
      transition: { duration: 0.5 }
    },
    circle: {
      initial: { scale: 0 },
      animate: { scale: 1 },
      transition: { duration: 0.3 }
    }
  };

  const MotionDiv = motion.div;

  const renderCardSkeleton = () => (
    <MotionDiv
      variants={skeletonVariants.card}
      initial="initial"
      animate="animate"
      className={`glass-panel p-6 ${className}`}
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="skeleton w-16 h-16 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className={`skeleton ${height} w-3/4 rounded`}></div>
          <div className={`skeleton ${height} w-1/2 rounded`}></div>
        </div>
      </div>
      <div className="space-y-2">
        {[...Array(lines)].map((_, i) => (
          <div 
            key={i} 
            className={`skeleton ${height} ${i === lines - 1 ? 'w-2/3' : width} rounded`}
          ></div>
        ))}
      </div>
    </MotionDiv>
  );

  const renderLineSkeleton = () => (
    <MotionDiv
      variants={skeletonVariants.line}
      initial="initial"
      animate="animate"
      className={`skeleton ${height} ${width} rounded ${className}`}
    />
  );

  const renderCircleSkeleton = () => (
    <MotionDiv
      variants={skeletonVariants.circle}
      initial="initial"
      animate="animate"
      className={`skeleton rounded-full ${className}`}
    />
  );

  const renderTextSkeleton = () => (
    <div className={`space-y-2 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <MotionDiv
          key={i}
          variants={skeletonVariants.line}
          initial="initial"
          animate="animate"
          transition={{ delay: i * 0.1 }}
          className={`skeleton ${height} ${i === lines - 1 ? 'w-3/4' : width} rounded`}
        />
      ))}
    </div>
  );

  const renderImageSkeleton = () => (
    <MotionDiv
      variants={skeletonVariants.card}
      initial="initial"
      animate="animate"
      className={`skeleton rounded-lg ${className}`}
      style={{ aspectRatio: '16/9' }}
    />
  );

  const renderButtonSkeleton = () => (
    <MotionDiv
      variants={skeletonVariants.card}
      initial="initial"
      animate="animate"
      className={`skeleton h-12 w-32 rounded-xl ${className}`}
    />
  );

  const renderTableSkeleton = () => (
    <MotionDiv
      variants={skeletonVariants.card}
      initial="initial"
      animate="animate"
      className={`space-y-4 ${className}`}
    >
      {/* Header */}
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-8 rounded"></div>
        ))}
      </div>
      {/* Rows */}
      {[...Array(3)].map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, colIndex) => (
            <div key={colIndex} className="skeleton h-6 rounded"></div>
          ))}
        </div>
      ))}
    </MotionDiv>
  );

  switch (type) {
    case 'card':
      return renderCardSkeleton();
    case 'line':
      return renderLineSkeleton();
    case 'circle':
      return renderCircleSkeleton();
    case 'text':
      return renderTextSkeleton();
    case 'image':
      return renderImageSkeleton();
    case 'button':
      return renderButtonSkeleton();
    case 'table':
      return renderTableSkeleton();
    default:
      return renderCardSkeleton();
  }
};

export default LoadingSkeleton;