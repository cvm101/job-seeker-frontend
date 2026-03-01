"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    // Profile State
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [skills, setSkills] = useState("");
    const [yearsOfExperience, setYearsOfExperience] = useState<number | "">("");
    const [templateText, setTemplateText] = useState("Hi, I'm [Name]. I have expertise in [Skills] and I would love to work at [Company] as a [Role].");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Matches State
    const [matches, setMatches] = useState<any[]>([]);
    const [loadingMatches, setLoadingMatches] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/");
            } else {
                setUser(user);
                fetchMatches(user.id);
            }
        };
        checkUser();
    }, [router]);

    // Fetch the jobs your AI engine found!
    const fetchMatches = async (userId: string) => {
        setLoadingMatches(true);
        const { data, error } = await supabase
            .from("matched_jobs")
            .select("*")
            .eq("user_id", userId);

        if (error) {
            console.error("Error fetching matches:", error);
        } else if (data) {
            // Reverse the array so the newest jobs show up at the top
            setMatches(data.reverse());
        }
        setLoadingMatches(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!user) return;

        const skillsArray = skills.split(',').map(skill => skill.trim()).filter(Boolean);

        const { error: profileError } = await supabase
            .from("profiles")
            .upsert({
                id: user.id,
                first_name: firstName,
                last_name: lastName,
                top_skills: skillsArray,
                years_of_experience: Number(yearsOfExperience)
            });

        const { error: templateError } = await supabase
            .from("templates")
            .upsert({
                user_id: user.id,
                content: templateText,
                template_name: "Default",
                is_default: true
            });

        if (profileError || templateError) {
            setMessage("Error saving: " + (profileError?.message || templateError?.message));
        } else {
            setMessage("Profile and Template saved successfully! The engine is ready.");
        }
        setLoading(false);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Cover letter copied! Ready to paste.");
    };

    if (!user) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* LEFT COLUMN: Engine Settings */}
                <div className="md:col-span-1 bg-gray-800 p-6 rounded-xl shadow-lg h-fit">
                    <h2 className="text-2xl font-bold mb-6 text-blue-400">Engine Settings</h2>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="flex gap-2">
                            <div className="w-1/2">
                                <label className="block text-xs font-medium mb-1">First Name</label>
                                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400 text-sm" required />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-xs font-medium mb-1">Last Name</label>
                                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400 text-sm" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-1">Skills (comma separated)</label>
                            <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400 text-sm" placeholder="Java, Spring, AWS" required />
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-1">Years Exp.</label>
                            <input type="number" min="0" value={yearsOfExperience} onChange={(e) => setYearsOfExperience(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400 text-sm" required />
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-1">Cover Letter Template</label>
                            <textarea value={templateText} onChange={(e) => setTemplateText(e.target.value)} rows={6} className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400 text-sm" required />
                        </div>

                        {message && <div className={`p-2 rounded text-sm ${message.includes("Error") ? "bg-red-900/50 text-red-200" : "bg-green-900/50 text-green-200"}`}>{message}</div>}

                        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition text-sm">
                            {loading ? "Saving..." : "Update Engine"}
                        </button>
                    </form>
                </div>

                {/* RIGHT COLUMN: Job Feed */}
                <div className="md:col-span-2">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                        <span>🔥</span> Your Job Matches
                    </h2>

                    {loadingMatches ? (
                        <div className="text-gray-400 animate-pulse">Consulting the AI Engine...</div>
                    ) : matches.length === 0 ? (
                        <div className="bg-gray-800 p-8 rounded-xl text-center text-gray-400 border border-dashed border-gray-600">
                            No matches yet! Make sure your GitHub Action has run.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {matches.map((job) => (
                                <div key={job.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition duration-300 shadow-lg">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">{job.role_title}</h3>
                                            <p className="text-blue-400 font-semibold text-lg">{job.company_name}</p>
                                        </div>
                                        <span className="bg-green-900/50 text-green-400 px-3 py-1 rounded-full text-sm font-bold border border-green-800">
                      {job.match_score}% Match
                    </span>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">Generated Cover Letter</p>
                                        <div className="bg-gray-900 p-4 rounded-lg text-sm text-gray-300 font-mono whitespace-pre-wrap border border-gray-700">
                                            {job.referral_message}
                                        </div>
                                    </div>

                                    <div className="flex gap-4 mt-4">
                                        <button
                                            onClick={() => copyToClipboard(job.referral_message)}
                                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition"
                                        >
                                            📋 Copy Letter
                                        </button>
                                        <a
                                            href={job.job_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 px-4 rounded transition"
                                        >
                                            🚀 Apply Now
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}