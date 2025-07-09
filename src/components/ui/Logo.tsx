import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { container: 'w-8 h-8', icon: 'w-5 h-5', text: 'text-lg' },
    md: { container: 'w-12 h-12', icon: 'w-7 h-7', text: 'text-xl' },
    lg: { container: 'w-16 h-16', icon: 'w-10 h-10', text: 'text-3xl' }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <motion.div 
        whileHover={{ scale: 1.05, rotate: 5 }}
        transition={{ duration: 0.2 }}
        className={`${currentSize.container} bg-gradient-to-br from-[#00FFA3] via-[#00D4AA] to-[#FF61F6] rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg`}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        
        {/* Simple leaf icon */}
        <svg 
          className={`${currentSize.icon} text-black relative z-10`} 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          {/* Simple leaf shape */}
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.06.82C6.16 17.4 9 14 17 12c8-2 10.83-5.4 12.12-10.16l-1.06-.82C26.1 7.83 24 4 17 8z"/>
          <path d="M17 8c0 0-4-6-10-4s-4 8-4 8c4-1 8 2 14-4z"/>
        </svg>
        
        {/* Shine effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
          animate={{ x: [-100, 100] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
      </motion.div>
      
      {showText && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`${currentSize.text} font-bold tracking-wider text-white`}
        >
          TUMBUH.in
        </motion.span>
      )}
    </div>
  );
}