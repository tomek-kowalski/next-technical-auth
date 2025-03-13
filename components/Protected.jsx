import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import mainStyle from "../styles/Protected.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import MermaidChart from "./MermaidChart";

export default function Protected() {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const contentRef = useRef(null);

  useEffect(() => {
    if (session) {
      fetch("/api/docs")
        .then((res) => res.json())
        .then((data) => setContent(data.content));


      document.addEventListener("DOMContentLoaded", () => {
        console.log('loaded script');
        const tableOfContents = Array.from(
          document.querySelectorAll("table th")
        ).find((th) => th.innerText.trim() === "Table of Contents");
        console.log('tableOfContents ',tableOfContents );
        if (tableOfContents) {
          const tocLinks = tableOfContents.closest("table").querySelectorAll("td a[href^='#']");
          tocLinks.forEach((link) => {
            link.addEventListener("click", handleToCClick);
          });
        }
      });

      return () => {
        const tocLinks = document.querySelectorAll("table td a[href^='#']");
        tocLinks.forEach((link) => {
          link.removeEventListener("click", handleToCClick);
        });
      };
    }
  }, [session]);


  const handleToCClick = (e) => {
    e.preventDefault();

    const targetId = e.target.getAttribute("href").substring(1);
    
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

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
        {/* Markdown Content */}
        <div ref={contentRef}>
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
    </div>
  );
}
