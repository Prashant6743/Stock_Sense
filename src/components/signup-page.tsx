'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, Phone, Eye, EyeOff, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/icons';

interface SignUpPageProps {
  onBack: () => void;
  onSignUp: (data: { name: string; email: string; password: string; phone?: string }) => void;
}

type SignUpStep = 'method' | 'email' | 'phone' | 'otp' | 'complete';

export function SignUpPage({ onBack, onSignUp }: SignUpPageProps) {
  const [step, setStep] = useState<SignUpStep>('method');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    otp: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);

  const handleGoogleSignUp = () => {
    setIsLoading(true);
    // Simulate Google OAuth
    setTimeout(() => {
      setIsLoading(false);
      onSignUp({
        name: 'Google User',
        email: 'user@gmail.com',
        password: 'google-auth',
      });
    }, 2000);
  };

  const handleEmailSignUp = () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
    }, 1500);
  };

  const handlePhoneSignUp = () => {
    setIsLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      // Start OTP timer
      const timer = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1500);
  };

  const handleOtpVerification = () => {
    if (formData.otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('complete');
      setTimeout(() => {
        onSignUp({
          name: formData.name,
          email: formData.email,
          password: 'phone-auth',
          phone: formData.phone,
        });
      }, 2000);
    }, 1500);
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 2) return 'bg-yellow-500';
    if (strength <= 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 1) return 'Weak';
    if (strength <= 2) return 'Fair';
    if (strength <= 3) return 'Good';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/8 to-teal-500/8 rounded-full blur-3xl" style={{ animation: 'pulse 8s ease-in-out infinite' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/6 to-red-500/6 rounded-full blur-3xl" style={{ animation: 'pulse 12s ease-in-out infinite', animationDelay: '4s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/5 to-emerald-500/5 rounded-full blur-3xl" style={{ animation: 'pulse 10s ease-in-out infinite', animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl"
             style={{
               boxShadow: "0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
               transformStyle: "preserve-3d"
             }}>
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="absolute left-0 top-0 text-gray-400 hover:text-white p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-white p-3 rounded-xl">
              <Logo className="h-8 w-8 text-black" />
            </div>
            <span className="text-2xl font-bold text-white">
              Stock Sense
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Method Selection */}
          {step === 'method' && (
            <motion.div
              key="method"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                <p className="text-gray-400">Choose your preferred sign-up method</p>
              </div>

              <Button
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="w-full bg-white hover:bg-gray-100 text-black border-0 py-3 text-lg font-medium"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin mr-2" />
                ) : (
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-black px-4 text-gray-400">or</span>
                </div>
              </div>

              <Button
                onClick={() => setStep('email')}
                variant="outline"
                className="w-full border-gray-600 bg-gray-800 text-white hover:bg-gray-700 hover:border-gray-500 active:bg-gray-600 focus:bg-gray-700 focus:border-gray-500 py-3 text-lg"
              >
                <Mail className="w-5 h-5 mr-2" />
                Continue with Email
              </Button>

              <Button
                onClick={() => setStep('phone')}
                variant="outline"
                className="w-full border-gray-600 bg-gray-800 text-white hover:bg-gray-700 hover:border-gray-500 active:bg-gray-600 focus:bg-gray-700 focus:border-gray-500 py-3 text-lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Continue with Phone
              </Button>
            </motion.div>
          )}

          {/* Email Sign Up */}
          {step === 'email' && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                <p className="text-gray-400">Enter your details to get started</p>
              </div>

              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 py-3 hover:bg-gray-800/80 hover:border-gray-600 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                />

                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 py-3 hover:bg-gray-800/80 hover:border-gray-600 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                />

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 py-3 pr-12 hover:bg-gray-800/80 hover:border-gray-600 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength(formData.password))}`}
                          style={{ width: `${(passwordStrength(formData.password) / 4) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400">
                        {getStrengthText(passwordStrength(formData.password))}
                      </span>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 py-3 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                onClick={handleEmailSignUp}
                disabled={isLoading || !formData.name || !formData.email || !formData.password || !formData.confirmPassword}
                className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white border-0 py-3 text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : null}
                Create Account
              </Button>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep('method')}
                  variant="ghost"
                  className="flex-1 text-gray-400 hover:text-white"
                >
                  Back to options
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                >
                  Try Demo
                </Button>
              </div>
            </motion.div>
          )}

          {/* Phone Sign Up */}
          {step === 'phone' && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Phone Verification</h1>
                <p className="text-gray-400">We'll send you a verification code</p>
              </div>

              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 py-3 hover:bg-gray-800/80 hover:border-gray-600 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                />

                <Input
                  type="email"
                  placeholder="Email Address (Optional)"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 py-3 hover:bg-gray-800/80 hover:border-gray-600 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                />

                <Input
                  type="tel"
                  placeholder="Phone Number (+1 234 567 8900)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 py-3 hover:bg-gray-800/80 hover:border-gray-600 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                />
              </div>

              <Button
                onClick={handlePhoneSignUp}
                disabled={isLoading || !formData.name || !formData.phone}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0 py-3 text-lg shadow-lg hover:shadow-teal-500/25 transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : null}
                Send Verification Code
              </Button>

              <Button
                onClick={() => setStep('method')}
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
              >
                Back to options
              </Button>
            </motion.div>
          )}

          {/* OTP Verification */}
          {step === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Enter Verification Code</h1>
                <p className="text-gray-400">
                  We sent a 6-digit code to<br />
                  <span className="text-white font-medium">{formData.phone}</span>
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 py-3 text-center text-2xl tracking-widest"
                  maxLength={6}
                />

                {otpTimer > 0 ? (
                  <p className="text-center text-gray-400 text-sm">
                    Resend code in {otpTimer}s
                  </p>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full text-blue-400 hover:text-blue-300"
                    onClick={() => {
                      setOtpTimer(30);
                      const timer = setInterval(() => {
                        setOtpTimer(prev => {
                          if (prev <= 1) {
                            clearInterval(timer);
                            return 0;
                          }
                          return prev - 1;
                        });
                      }, 1000);
                    }}
                  >
                    Resend Code
                  </Button>
                )}
              </div>

              <Button
                onClick={handleOtpVerification}
                disabled={isLoading || formData.otp.length !== 6}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 py-3 text-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : null}
                Verify Code
              </Button>

              <Button
                onClick={() => setStep('phone')}
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
              >
                Change Phone Number
              </Button>
            </motion.div>
          )}

          {/* Completion */}
          {step === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto">
                <Check className="h-10 w-10 text-black" />
              </div>
              
              <div>
                <h1 className="text-3xl font-bold mb-2">Account Created!</h1>
                <p className="text-gray-400">
                  Welcome to Stock Sense, {formData.name}!<br />
                  Redirecting you to the dashboard...
                </p>
              </div>

              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
