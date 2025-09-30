import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const OTPComponent = ({ 
  email, 
  onVerifySuccess, 
  onBackToLogin, 
  otpLength = 6,
  endpoint,
  initialTimer = 300
}) => {
  const [otp, setOtp] = useState(new Array(otpLength).fill(''));
  const [timeLeft, setTimeLeft] = useState(initialTimer);
  const [isExpired, setIsExpired] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timeLeft > 0 && !isExpired) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsExpired(true);
    }
  }, [timeLeft, isExpired]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleChange = (element, index) => {
    const value = element.value;
    
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otpLength - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('').slice(0, otpLength);
    
    if (pasteArray.every(char => /^[0-9]$/.test(char))) {
      const newOtp = [...otp];
      pasteArray.forEach((char, index) => {
        if (index < otpLength) {
          newOtp[index] = char;
        }
      });
      setOtp(newOtp);
      const nextEmptyIndex = newOtp.findIndex(val => val === '');
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : otpLength - 1;
      inputRefs.current[focusIndex].focus();
    }
  };
  const handleVerifyOTP = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== otpLength) {
      toast.error(`Please enter complete ${otpLength}-digit OTP`);
      return;
    }

    if (isExpired) {
      toast.error('OTP has expired. Please request a new one.');
      return;
    }

    setIsVerifying(true);
    console.log(email)
    try {
      const response = await fetch(`/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userID: email,
          otp: otpValue
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.status === "SUCCESS") {
        toast.success('OTP verified successfully!');
        onVerifySuccess();
      } else {
        toast.error(data.message || 'Invalid OTP. Please try again.');
        setOtp(new Array(otpLength).fill(''));
        inputRefs.current[0].focus();
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };
  const handleResendOTP = async () => {
    setIsResending(true);

    try {
      const response = await fetch('/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userID: email
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.status === 'SUCCESS') {
        toast.success('New OTP sent successfully!');
        setOtp(new Array(otpLength).fill(''));
        setTimeLeft(initialTimer);
        setIsExpired(false);
        inputRefs.current[0].focus();
      } else {
        toast.error(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsResending(false);
    }
  };
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <div className="w-5 h-5 bg-white rounded-full relative">
                  <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <div className="absolute top-1.5 right-1 w-1 h-1 bg-blue-500 rounded-full"></div>
                  <div className="absolute bottom-1 left-1.5 w-1 h-1 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">HD</h1>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900">Verify OTP</h2>
            <p className="text-gray-600 mt-2">
              We've sent a {otpLength}-digit code to{' '}
              <span className="font-semibold text-gray-900">{email}</span>
            </p>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Enter {otpLength}-digit OTP
              </label>
              <div className="flex justify-between space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className={`w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      isExpired 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 bg-white hover:border-blue-300'
                    }`}
                    disabled={isExpired}
                  />
                ))}
              </div>
            </div>
            <div className="text-center">
              {!isExpired ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-600">
                    OTP expires in{' '}
                    <span className="font-semibold text-blue-600">
                      {formatTime(timeLeft)}
                    </span>
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-sm text-red-600 font-semibold">
                    OTP has expired
                  </span>
                </div>
              )}
            </div>
            {!isExpired ? (
              <button
                onClick={handleVerifyOTP}
                disabled={isVerifying || otp.join('').length !== otpLength}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  otp.join('').length === otpLength && !isVerifying
                    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying OTP...
                  </div>
                ) : (
                  'Verify OTP'
                )}
              </button>
            ) : (
              <button
                onClick={handleResendOTP}
                disabled={isResending}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isResending ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resending OTP...
                  </div>
                ) : (
                  'Resend OTP'
                )}
              </button>
            )}
            {!isExpired && (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="text-blue-600 hover:text-blue-500 font-medium focus:outline-none focus:underline transition-colors"
                  >
                    Resend OTP
                  </button>
                </p>
              </div>
            )}
            <div className="text-center">
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-gray-600 hover:text-gray-800 font-medium focus:outline-none focus:underline transition-colors"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-green-900 via-blue-800 to-teal-700 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal-400/30 to-green-600/40 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-32 left-0 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-teal-500/30 rounded-full blur-2xl transform -translate-x-8"></div>
            <div className="absolute top-0 left-16 w-72 h-72 bg-gradient-to-br from-green-300/25 to-blue-700/35 rounded-full blur-2xl transform -translate-y-8"></div>
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <div className="w-80 h-80 relative">
                <div className="absolute inset-0 bg-gradient-to-l from-teal-300 via-green-400 to-blue-300 rounded-2xl transform rotate-12 opacity-80 blur-sm"></div>
                <div className="absolute inset-2 bg-gradient-to-l from-teal-400 via-green-500 to-blue-400 rounded-2xl transform -rotate-6 opacity-90"></div>
                <div className="absolute inset-4 bg-gradient-to-l from-teal-500 via-green-600 to-blue-500 rounded-2xl transform rotate-3 opacity-95"></div>
                <div className="absolute inset-6 bg-gradient-to-l from-teal-600 via-green-700 to-blue-600 rounded-2xl flex items-center justify-center">
                  <div className="text-white/80 text-6xl">
                    <svg fill="currentColor" viewBox="0 0 24 24" className="w-16 h-16">
                      <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11C15.4,11 16,11.4 16,12V16C16,16.6 15.6,17 15,17H9C8.4,17 8,16.6 8,16V12C8,11.4 8.4,11 9,11V10C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,8.7 10.2,10V11H13.8V10C13.8,8.7 12.8,8.2 12,8.2Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-32 right-20 w-4 h-4 bg-teal-300/50 rounded-full blur-sm animate-pulse delay-200"></div>
            <div className="absolute bottom-20 left-32 w-6 h-6 bg-green-300/40 rounded-full blur-sm animate-pulse delay-500"></div>
            <div className="absolute top-1/3 right-10 w-3 h-3 bg-blue-400/60 rounded-full blur-sm animate-pulse delay-800"></div>
            <div className="absolute bottom-32 right-1/3 w-5 h-5 bg-teal-400/50 rounded-full blur-sm animate-pulse delay-1100"></div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 via-transparent to-teal-800/10"></div>
      </div>
    </div>
  );
};

export default OTPComponent;