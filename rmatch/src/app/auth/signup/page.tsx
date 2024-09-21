// src/app/auth/signup/page.tsx

"use client"; // Mark the component as a Client Component

import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useRouter } from "next/navigation"; // Use next/navigation for App Router
import Image from "next/image"; // Import Image for logo usage
import logo from "../../img/logo.png";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter(); // Import useRouter from next/navigation

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        const { user, session, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            router.push("/profile"); // Redirect to profile on success
        }
    };

    return (
        <div className="flex items-center justify-center bg-gradient-to-r from-red-500 to-blue-700" style={{ height: "100vh" }}>
            <div className="w-full max-w-md px-12 py-8 bg-white rounded-md shadow-md">
                <div className="flex justify-center">
                    <Image src={logo} alt="RMatch Logo" width={240} height={120} />{" "}
                </div>
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create an account</h2>
                {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
                <form onSubmit={handleSignup} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email or phone number</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-200 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-200 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <label className="text-sm text-gray-600">Remember me</label>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-gradient-to-r from-red-500 to-blue-700 rounded-md hover:from-red-600 hover:to-blue-800">
                        Sign Up
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <a href="/auth/login" className="text-blue-600 hover:underline">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
