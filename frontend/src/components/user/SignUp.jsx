import { useFormik } from "formik";
import ValidationSchema from "./ValidationSchema.js";
import { toast } from 'react-toastify';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/auth.js";
import OTPComponent from './OTPComponent';

export default function SignUp() {
    const { authorized, loading } = useAuth();
    const [isLoading, setIsLoading] = useState(null);
    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [showOTP, setShowOTP] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    const { values, errors, handleChange, handleBlur, handleSubmit, touched } = useFormik({
        initialValues: {
            userName: "",
            userID: "",
            phoneNumber: 0,
            password: "",
            confirmPassword: ""
        },
        validationSchema: ValidationSchema,
        onSubmit: (values) => {
            console.log(values);
            setIsLoading(true);
            fetch("/signup", {
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
                    toast.error("Process failed. Please try again.");
                    setIsError(true);
                    setErrorMsg("Process failed");
                });
        }
    });
    const handleOTPVerifySuccess = (data) => {
        navigate("/dashboard");
        toast.success("Signup completed successfully!");
    };

    const handleBackToLogin = () => {
        setShowOTP(false);
        setUserEmail('');
        setIsError(false);
        setErrorMsg(null);
    };

    if (authorized && !loading) navigate("/dashboard");
    if (showOTP) {
        return (
            <OTPComponent
                email={values.userID}
                onVerifySuccess={handleOTPVerifySuccess}
                onBackToLogin={handleBackToLogin}
                otpLength={6}
                endpoint={"signupotp"}
                initialTimer={300}
            />
        );
    }
    else return (
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

                        <h2 className="text-3xl font-bold text-gray-900">Sign up</h2>
                        <p className="text-gray-600 mt-2">Sign up to enjoy the feature of HD</p>
                    </div>
                    {isError && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-700 text-sm">{errorMsg}</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                                Your Name
                            </label>
                            <input
                                id="userName"
                                name="userName"
                                type="text"
                                value={values.userName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Jonas Khanwald"
                                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${touched.userName && errors.userName
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300'
                                    }`}
                            />
                            {touched.userName && errors.userName && (
                                <p className="mt-2 text-sm text-red-600">{errors.userName}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="userID" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="userID"
                                name="userID"
                                type="email"
                                value={values.userID}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="jonas_kahnwald@gmail.com"
                                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${touched.userID && errors.userID
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300'
                                    }`}
                            />
                            {touched.userID && errors.userID && (
                                <p className="mt-2 text-sm text-red-600">{errors.userID}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                value={values.phoneNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="+91"
                                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${touched.phoneNumber && errors.phoneNumber
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300'
                                    }`}
                            />
                            {touched.phoneNumber && errors.phoneNumber && (
                                <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="••••••••"
                                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${touched.password && errors.password
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300'
                                    }`}
                            />
                            {touched.password && errors.password && (
                                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="••••••••"
                                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${touched.confirmPassword && errors.confirmPassword
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300'
                                    }`}
                            />
                            {touched.confirmPassword && errors.confirmPassword && (
                                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
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
                                    Creating Account...
                                </div>
                            ) : (
                                'Get OTP'
                            )}
                        </button>
                        <div className="text-center">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="text-blue-600 hover:text-blue-500 font-medium"
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
            <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-blue-600/40 rounded-full blur-3xl transform -translate-x-16 -translate-y-16"></div>
                        <div className="absolute top-32 right-0 w-80 h-80 bg-gradient-to-tl from-cyan-400/20 to-blue-500/30 rounded-full blur-2xl transform translate-x-8"></div>
                        <div className="absolute bottom-0 left-16 w-72 h-72 bg-gradient-to-tr from-blue-300/25 to-blue-700/35 rounded-full blur-2xl transform translate-y-8"></div>
                        <div className="relative z-10 w-full h-full flex items-center justify-center">
                            <div className="w-80 h-80 relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-300 rounded-3xl transform rotate-12 opacity-80 blur-sm"></div>
                                <div className="absolute inset-2 bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 rounded-3xl transform -rotate-6 opacity-90"></div>
                                <div className="absolute inset-4 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 rounded-3xl transform rotate-3 opacity-95"></div>
                                <div className="absolute inset-6 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 rounded-3xl"></div>
                            </div>
                        </div>
                        <div className="absolute top-20 left-20 w-4 h-4 bg-cyan-300/50 rounded-full blur-sm animate-pulse"></div>
                        <div className="absolute bottom-32 right-32 w-6 h-6 bg-blue-300/40 rounded-full blur-sm animate-pulse delay-300"></div>
                        <div className="absolute top-1/2 left-10 w-3 h-3 bg-cyan-400/60 rounded-full blur-sm animate-pulse delay-700"></div>
                        <div className="absolute bottom-20 left-1/3 w-5 h-5 bg-blue-400/50 rounded-full blur-sm animate-pulse delay-1000"></div>
                    </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-blue-800/10"></div>
            </div>
        </div>
    );
}