"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const router = useRouter();

    // State to toggle between Login and Sign Up
    const [isLogin, setIsLogin] = useState(true);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccessMsg("");

        if (isLogin) {
            // LOGIN LOGIC
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (authError) {
                setError(authError.message);
                setLoading(false);
            } else {
                router.push("/dashboard");
            }
        } else {
            // SIGN UP LOGIC
            const { data, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (authError) {
                setError(authError.message);
                setLoading(false);
            } else {
                if (data.session) {
                    // If auto-login is enabled in Supabase
                    router.push("/dashboard");
                } else {
                    // If email confirmation is required
                    setSuccessMsg("Success! Please check your email to confirm your account.");
                    setLoading(false);
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">

                <h2 className="text-3xl font-bold text-white mb-2 text-center">
                    Job<span className="text-blue-500">Hunter</span> Engine
                </h2>
                <p className="text-gray-400 text-center mb-8">
                    {isLogin ? "Welcome back to your dashboard." : "Create your engine account."}
                </p>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6 text-sm">
                        {error}
                    </div>
                )}

                {/* Success Message (for Sign Up) */}
                {successMsg && (
                    <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded mb-6 text-sm">
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-5">
                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-blue-500 transition"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-blue-500 transition"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition mt-2 flex justify-center items-center"
                    >
                        {loading ? (
                            <span className="animate-pulse">{isLogin ? "Authenticating..." : "Creating Account..."}</span>
                        ) : (
                            isLogin ? "Initialize Engine 🚀" : "Sign Up 🚀"
                        )}
                    </button>
                </form>

                {/* The Toggle Button to switch between Login and Sign Up */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError("");
                            setSuccessMsg("");
                        }}
                        className="text-gray-400 hover:text-white transition text-sm"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                    </button>
                </div>

            </div>
        </div>
    );
}