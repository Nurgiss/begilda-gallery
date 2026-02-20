import { useEffect } from 'react';

interface SnackbarProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Snackbar({ message, isVisible, onClose, duration = 3000 }: SnackbarProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        transform: `translateX(-50%) ${isVisible ? 'translateY(0)' : 'translateY(100px)'}`,
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        padding: '16px 32px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        zIndex: 10000,
        fontSize: '15px',
        fontWeight: '500',
        letterSpacing: '0.3px',
        animation: isVisible ? 'slideUp 0.3s ease-out' : 'slideDown 0.3s ease-in',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease, transform 0.3s ease'
      }}
    >
      {message}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          to {
            opacity: 0;
            transform: translateX(-50%) translateY(100px);
          }
        }
      `}</style>
    </div>
  );
}
