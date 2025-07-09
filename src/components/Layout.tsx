import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Upload, 
  BarChart3, 
  Lightbulb, 
  AlertTriangle, 
  Trophy,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from './ui/Button';
import { Logo } from './ui/Logo';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', icon: Home, key: 'dashboard' },
    { name: 'Input Data', icon: Upload, key: 'input' },
    { name: 'Statistik', icon: BarChart3, key: 'stats' },
    { name: 'Prediksi', icon: Lightbulb, key: 'prediction' },
    { name: 'Peringatan', icon: AlertTriangle, key: 'warning' },
    { name: 'Leaderboard', icon: Trophy, key: 'leaderboard' },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0F0F0F]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Logo size="sm" showText={true} />
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    currentPage === item.key
                      ? 'bg-[#00FFA3]/20 text-[#00FFA3] shadow-[0_0_10px_rgba(0,255,163,0.3)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user && (
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-400">Rank #{user.rank}</p>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-[#00FFA3] to-[#FF61F6] rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-black" />
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="hidden md:flex"
              >
                <LogOut className="h-4 w-4" />
              </Button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/5"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-[#1A1A1A] border-t border-white/10"
          >
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    onNavigate(item.key);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                    currentPage === item.key
                      ? 'bg-[#00FFA3]/20 text-[#00FFA3]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              ))}
              <div className="border-t border-white/10 pt-2 mt-2">
                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}