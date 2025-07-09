import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
      className={cn(
        'bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6',
        'shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
        hover && 'hover:border-[#00FFA3]/30 hover:shadow-[0_0_20px_rgba(0,255,163,0.1)]',
        className
      )}
    >
      {children}
    </motion.div>
  );
}