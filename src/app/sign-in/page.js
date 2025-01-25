"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Input, Button, Card, Spacer } from "@nextui-org/react";
import toast from "react-hot-toast";
import styles from "@/assets/auth/Login.module.css";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/assets/icons/EyeSlashFilledIcon";
import { setCookie } from "cookies-next";

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "", role: "admin" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        setErrors({ ...errors, [field]: "" }); // Clear error when user types
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        }
        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleLogin = async () => {
        if (!validateForm()) return; // Stop if form is invalid

        setLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, formData);
            if (response.data?.success) {
                const token = response.data.access_token;

                setCookie("token", token)

                toast.success("Login successful!");
                router.push("/");
            } else {
                toast.error(response.message || "Login failed!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={styles.container}>
            <form className={styles.card}>
                {/* <h2>Login</h2> */}
                <Spacer y={1} />
                {/* Email Input */}
                <Input
                    isRequired
                    label="Email"
                    labelPlacement="outside"
                    placeholder="Enter your email"
                    variant="bordered"
                    fullWidth
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                />
                {/* {errors.email && <p className={styles.errorText}>{errors.email}</p>} */}
                <Spacer y={3} />

                {/* Password Input */}
                <Input
                    label="Password"
                    isRequired
                    type={isVisible ? "text" : "password"}
                    labelPlacement="outside"
                    variant="bordered"
                    placeholder="Enter your password"
                    fullWidth
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    endContent={
                        <button
                            aria-label="toggle password visibility"
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleVisibility}
                        >
                            {isVisible ? (
                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                        </button>
                    }
                />
                {/* {errors.password && <p className={styles.errorText}>{errors.password}</p>} */}
                <Spacer y={4} />

                {/* Login Button */}
                <Button
                    color="primary"
                    fullWidth
                    type="submit"
                    onPress={handleLogin}
                    disabled={loading}
                    isLoading={loading}
                >
                    Login
                </Button>
                <Spacer y={1} />
            </form>
        </div>
    );
};

export default LoginPage;
