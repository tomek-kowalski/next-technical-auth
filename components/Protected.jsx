    import { useSession, signIn, signOut } from "next-auth/react";
    import { useState, useEffect } from "react";
    import ReactMarkdown from "react-markdown";

    export default function Protected() {
    const { data: session } = useSession();
    const [content, setContent] = useState("");

    useEffect(() => {
        if (session) {
        fetch("/api/docs")
            .then((res) => res.json())
            .then((data) => setContent(data.content));
        }
    }, [session]);

    if (!session) {
        return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>Please Sign In to View Documentation</h1>
            <button
            onClick={() => signIn("google")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            >
            Sign in with Google
            </button>
        </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
        <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded mb-4"
        >
            Sign Out
        </button>
        <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
    }