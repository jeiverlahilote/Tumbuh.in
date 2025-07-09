import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { Logo } from './ui/Logo';
import { FallingLeaves } from './FallingLeaves';
import { useAuth } from '../hooks/useAuth';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.email, formData.password, formData.name);
      }
    } catch (error: any) {
      setError(error.message || 'Terjadi kesalahan saat autentikasi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-4">
      {/* Falling Leaves Animation */}
      <FallingLeaves />
      
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 relative z-10"
        >
          <Logo size="lg" showText={true} className="justify-center" />
          <p className="text-gray-400 mt-2">
            Platform prediksi pertanian berbasis komunitas
          </p>
        </motion.div>

        {/* Auth Form */}
        <Card className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">
                {isLogin ? 'Masuk ke Akun' : 'Buat Akun Baru'}
              </h2>
              <p className="text-gray-400 text-sm">
                {isLogin 
                  ? 'Akses dashboard prediksi dan kontribusi komunitas'
                  : 'Bergabung dengan komunitas petani cerdas'
                }
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <Input
                  label="Nama Lengkap"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              )}

              <div className="relative">
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="petani@example.com"
                  required
                />
                <Mail className="absolute right-3 top-[38px] h-5 w-5 text-gray-400" />
              </div>

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Masukkan password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  isLogin ? 'Masuk' : 'Daftar'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-[#00FFA3] hover:text-[#FF61F6] font-medium transition-colors"
                >
                  {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
                </button>
              </p>
            </div>
          </motion.div>
        </Card>

        {/* Demo Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center relative z-10"
        >
        </motion.div>
      </div>
    </div>
  );
}