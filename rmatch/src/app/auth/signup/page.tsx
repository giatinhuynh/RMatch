// src/app/auth/signup/page.tsx

"use client"; // Mark the component as a Client Component

import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useRouter } from "next/navigation"; // Use next/navigation for App Router
import Image from "next/image"; // Import Image for logo usage

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 via-purple-500 to-blue-500">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <Image src="/img/logo.svg" alt="RMatch Logo" width={120} height={60} />
                </div>
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-600">Create an account</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSignup} className="space-y-6">
                    <div>
                        <label className="block text-gray-700">Email or phone number</label>
                        <input
                            type="email"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-500 text-gray-700"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-500 text-gray-700"
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
                        className="w-full py-3 bg-gradient-to-r from-red-500 to-blue-500 text-white font-bold rounded-lg hover:bg-gradient-to-l transition-all">
                        Sign Up
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <a href="/auth/login" className="text-blue-500 font-bold">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}
