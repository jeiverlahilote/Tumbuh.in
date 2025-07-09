import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  fullScreen?: boolean;
}

export function Dialog({ isOpen, onClose, children, title, className, fullScreen = false }: DialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'relative bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-2xl',
              'max-h-[90vh] overflow-hidden',
              fullScreen 
                ? 'w-[95vw] h-[95vh]' 
                : 'w-full max-w-4xl mx-4',
              className
            )}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            )}
            
            {/* Content */}
            <div className={cn(
              'overflow-y-auto',
              title ? 'p-6' : 'p-0',
              fullScreen ? 'h-full' : 'max-h-[70vh]'
            )}>
              {children}
            </div>
            
            {/* Close button for fullscreen without title */}
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}