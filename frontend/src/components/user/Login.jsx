import { useState } from "react";
import { useFormik } from "formik";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAuth from "../../auth/auth";
import OTPComponent from './OTPComponent';

export default function Login() {
    const { authorized, loading } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    const { values, errors, handleChange, handleBlur, handleSubmit, touched } = useFormik({
        initialValues: {
            userID: "",
            password: ""
        },
        validate: values => {
            const errors = {};
            Object.keys(values).forEach(field => {
                if (!values[field]) {
                    errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
                }
            });

            if (values.userID && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.userID)) {
                errors.userID = 'Invalid email address';
            }

            return errors;
        },
        onSubmit: (values) => {
            setIsLoading(true);
            setIsError(false);
            setErrorMsg(null);

            fetch("/signin", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(values),
                credentials: "include"
            })
                .then(response => response.json())
                .then(data => {
                    setIsLoading(false);
                    if (data.status === "SUCCESS") {
                        setUserEmail(values.userID);
                        setShowOTP(true);
                        toast.success("OTP sent to your email. Please check your inbox.");

                    } else if (data.status === "FAILED") {
                        toast.error(data.message);
                        setIsError(true);
                        setErrorMsg(data.message);
                    }
                })
                .catch((error) => {
                    setIsLoading(false);
                    toast.error("Error while logging in. Please try again.");
                    setIsError(true);
                    setErrorMsg("Connection error. Please try again.");
                });
        }
    });
    const handleOTPVerifySuccess = () => {
        navigate("/dashboard");
        toast.success("Login completed successfully!");
    };

    const handleBackToLogin = () => {
        setShowOTP(false);
        setUserEmail('');
        setIsError(false);
        setErrorMsg(null);
    };

    const googleLoginHandler = () => {
        window.open("/auth/google", "_self");
    };

    if (authorized && !loading) navigate("/dashboard");

    if (showOTP) {
        return (
            <OTPComponent
                email={userEmail}
                onVerifySuccess={handleOTPVerifySuccess}
                onBackToLogin={handleBackToLogin}
                otpLength={6}
                endpoint={"verifyotp"}
                initialTimer={300}
            />
        );
    }
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm">
                    <div className="mb-10">
                        <div className="flex items-center mb-8">
                            <img
                                src="/icon.png"
                                alt="Logo"
                                class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
                            />
                            <h1 className="text-2xl font-bold text-gray-900">HD</h1>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
                        <p className="text-gray-600 mt-2">Welcome back! Please sign in to your account</p>
                    </div>
                    {isError && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-red-700 text-sm">{errorMsg}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="userID" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    id="userID"
                                    name="userID"
                                    type="email"
                                    autoComplete="email"
                                    value={values.userID}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="jonas_kahnwald@gmail.com"
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${touched.userID && errors.userID
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300'
                                        }`}
                                />
                                <div className="absolute left-3 top-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                            </div>
                            {touched.userID && errors.userID && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.userID}
                                </p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${touched.password && errors.password
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300'
                                        }`}
                                />
                                <div className="absolute left-3 top-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <button
                                    type="button"
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {touched.password && errors.password && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing In...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <button onClick={googleLoginHandler}
                                type="button"
                                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span className="ml-2" >Google</span>
                            </button>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => navigate('/signup')}
                                    className="text-blue-600 hover:text-blue-500 font-medium focus:outline-none focus:underline transition-colors"
                                >
                                    Sign up for free
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
            <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-700 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-400/30 to-indigo-600/40 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
                        <div className="absolute bottom-32 left-0 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-purple-500/30 rounded-full blur-2xl transform -translate-x-8"></div>
                        <div className="absolute top-0 left-16 w-72 h-72 bg-gradient-to-br from-indigo-300/25 to-blue-700/35 rounded-full blur-2xl transform -translate-y-8"></div>
                        <div className="relative z-10 w-full h-full flex items-center justify-center">
                            <div className="w-80 h-80 relative">
                                <div className="absolute inset-0 bg-gradient-to-l from-purple-300 via-indigo-400 to-blue-300 rounded-full transform -rotate-12 opacity-80 blur-sm"></div>
                                <div className="absolute inset-2 bg-gradient-to-l from-purple-400 via-indigo-500 to-blue-400 rounded-full transform rotate-6 opacity-90"></div>
                                <div className="absolute inset-4 bg-gradient-to-l from-purple-500 via-indigo-600 to-blue-500 rounded-full transform -rotate-3 opacity-95"></div>
                                <div className="absolute inset-6 bg-gradient-to-l from-purple-600 via-indigo-700 to-blue-600 rounded-full"></div>
                            </div>
                        </div>
                        <div className="absolute top-32 right-20 w-4 h-4 bg-purple-300/50 rounded-full blur-sm animate-pulse delay-200"></div>
                        <div className="absolute bottom-20 left-32 w-6 h-6 bg-indigo-300/40 rounded-full blur-sm animate-pulse delay-500"></div>
                        <div className="absolute top-1/3 right-10 w-3 h-3 bg-blue-400/60 rounded-full blur-sm animate-pulse delay-800"></div>
                        <div className="absolute bottom-32 right-1/3 w-5 h-5 bg-purple-400/50 rounded-full blur-sm animate-pulse delay-1100"></div>
                    </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 via-transparent to-purple-800/10"></div>
            </div>
        </div>
    );
}