import React, {useState, useEffect} from 'react';
import ProfileValidationSchema from "./profileValidation"
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

const ProfileModal = ({ isOpen, setIsModalOpen, data, setData }) => {
    if (!isOpen) return null;
    const [userData, setUserData] = useState(data);
    const [isLoading, setIsLoading] = useState(null);
    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const { values, errors, handleChange, handleBlur, handleSubmit, touched } = useFormik({
        initialValues: {
            userName: userData.userName,
            userID: userData.userID,
            phoneNumber: userData.phoneNumber
        },
        validationSchema: ProfileValidationSchema,
        onSubmit: (values) => {
            const body = { ...values, oldUserID: userData.userID }
            setIsLoading(true);
            fetch("/update", {
                method: "PUT",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(body),
                credentials: "include"
            })
                .then(response => response.json())
                .then(data => {
                    setIsLoading(false);
                    if (data.status === "SUCCESS") {
                        setIsModalOpen(false);
                        setUserData(data.data);
                        window.location.reload();
                        toast.success("User profile updated");
                    } else if (data.status === "FAILED") {
                        toast.error(data.message);
                        setIsError(true);
                        setErrorMsg(data.message);
                    }
                })
                .catch((error) => {
                    console.log(error)
                    toast.error("Process failed. Please try again.");
                    setIsError(true);
                    setErrorMsg("Process failed");
                });
        }
    });
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsModalOpen(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Profile</h3>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                id="userName"
                                name="userName"
                                value={values.userName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Enter username"
                                required
                            />
                            {touched.userName && errors.userName && (
                                <p className="mt-2 text-sm text-red-600">{errors.userName}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="userid" className="block text-sm font-medium text-gray-700 mb-1">
                                User ID
                            </label>
                            <input
                                type="text"
                                id="userID"
                                name="userID"
                                value={values.userID}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Enter user ID"
                                required
                            />{touched.userID && errors.userID && (
                                <p className="mt-2 text-sm text-red-600">{errors.userID}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={values.phoneNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Enter phone number"
                                pattern="[0-9]{10}"
                                title="Please enter a valid 10-digit phone number"
                            />
                            {touched.phoneNumber && errors.phoneNumber && (
                                <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={()=>{
                                setIsModalOpen(false)
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;