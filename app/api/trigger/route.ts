import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // Notice we are using process.env.GITHUB_TOKEN safely on the server!
        const response = await fetch(`https://api.github.com/repos/cvm101/job-hunter-backend/actions/workflows/daily-fetch.yml/dispatches`, {
            method: "POST",
            headers: {
                "Accept": "application/vnd.github.v3+json",
                "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ref: "main",
            }),
        });

        if (response.ok) {
            return NextResponse.json({ success: true, message: "Engine triggered successfully" });
        } else {
            const errorText = await response.text();
            return NextResponse.json({ success: false, error: errorText }, { status: response.status });
        }
    } catch (error) {
        console.error("Server error triggering action:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}