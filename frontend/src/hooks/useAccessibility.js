import { useEffect, useCallback } from 'react';

export const useAccessibility = () => {
  // Announce messages to screen readers
  const announceToScreenReader = useCallback((message) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event) => {
    // Escape key to close modals/menus
    if (event.key === 'Escape') {
      const activeElement = document.activeElement;
      const closeButton = activeElement?.closest('[data-close-on-escape]');
      
      if (closeButton) {
        closeButton.click();
      }
    }
    
    // Tab key trapping for modals
    if (event.key === 'Tab') {
      const modal = document.querySelector('[data-modal]');
      if (modal) {
        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          
          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    }
  }, []);

  // Focus management
  const trapFocus = useCallback((element) => {
    if (!element) return;
    
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, []);

  // Reduce motion preference
  const prefersReducedMotion = useCallback(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // High contrast preference
  const prefersHighContrast = useCallback(() => {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    announceToScreenReader,
    trapFocus,
    prefersReducedMotion,
    prefersHighContrast,
  };
};

export default useAccessibility;