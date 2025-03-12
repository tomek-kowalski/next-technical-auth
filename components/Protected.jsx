    import { useSession} from "next-auth/react";
    import { useState, useEffect } from "react";
    import mainStyle from "../styles/Protected.module.css";
    import ReactMarkdown from "react-markdown";
    import remarkGfm from "remark-gfm";
    import rehypeRaw from "rehype-raw";

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
        <div className={mainStyle.containerCenterStart}>
            <h1>Please Sign In to View Documentation</h1>
        </div>
        );
    }

    return (
        <div className={mainStyle.containerCenter}>
            <div className={mainStyle.technicalDocs}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {content}
            </ReactMarkdown>
            </div>
        </div>
    );
    }