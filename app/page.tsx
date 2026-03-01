"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setMessage(error.message);
        else setMessage("Success! Check your email to confirm your account.");
        setLoading(false);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setMessage(error.message);
        else setMessage("Logged in successfully! Welcome to the Job Hunter.");
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">Job Hunter</h1>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400 text-white"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400 text-white"
                            placeholder="••••••••"
                        />
                    </div>

                    {message && <p className="text-sm text-yellow-400 text-center">{message}</p>}

                    <div className="flex gap-4 pt-2">
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                        >
                            Login
                        </button>
                        <button
                            onClick={handleSignUp}
                            disabled={loading}
                            className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}