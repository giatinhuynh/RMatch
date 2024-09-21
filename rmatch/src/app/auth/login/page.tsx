// src/app/auth/login/page.tsx

"use client"; // Mark this as a Client Component

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import { supabase } from "../../services/supabaseClient"; // Adjust the path based on your structure
import Image from "next/image";
import logo from "../../img/logo.png";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter(); // Use useRouter for navigation in App Router

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            router.push("/profile"); // Redirect to profile page after successful login
        }
    };

    return (
        <div className="flex items-center justify-center bg-gradient-to-r from-red-500 to-blue-700" style={{ height: "calc(100vh - 54px)" }}>
            <div className="w-full max-w-md px-12 py-8 bg-white rounded-md shadow-md">
                <div className="flex justify-center">
                    <Image src={logo} alt="RMatch Logo" width={240} height={120} />
                </div>
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h1>
                {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-200 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-200 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="inline-flex items-center">
                            <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                        <a href="#" className="text-sm text-blue-600 hover:underline">
                            Forgot password?
                        </a>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-gradient-to-r from-red-500 to-blue-700 rounded-md hover:from-red-600 hover:to-blue-800">
                        Sign in
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don’t have an account?{" "}
                        <a href="/auth/signup" className="text-blue-600 hover:underline">
                            Sign up now
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
