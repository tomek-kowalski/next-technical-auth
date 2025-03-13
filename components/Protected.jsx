import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import mainStyle from "../styles/Protected.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import MermaidChart from "./MermaidChart";
import TableOfContents from "./TableOfContents";

export default function Protected() {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [hasTableOfContents, setHasTableOfContents] = useState(false);

  useEffect(() => {
    if (session) {
      fetch("/api/docs")
        .then((res) => res.json())
        .then((data) => {
          setContent(data.content);
        });
    }
  }, [session]);

  useEffect(() => {
    // Check for the table of contents after content has been rendered
    if (content) {
      const tableOfContentsExists = content.includes("<th>Table of Contents</th>");
      setHasTableOfContents(tableOfContentsExists);
    }
  }, [content]);

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
        {/* Conditionally render TableOfContents */}
        {hasTableOfContents && <TableOfContents />}

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={{
            code({ className, children, ...props }) {
              if (className && className.includes("language-mermaid")) {
                return <MermaidChart chartCode={String(children).trim()} />;
              }
              return <code className={className} {...props}>{children}</code>;
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
