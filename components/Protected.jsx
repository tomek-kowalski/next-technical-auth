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
  const [toc, setToc] = useState([]);

  useEffect(() => {
    if (session) {
      fetch("/api/docs")
        .then((res) => res.json())
        .then((data) => {
          setContent(data.content);
          generateTableOfContents(data.content);
        });
    }
  }, [session]);

  if (!session) {
    return (
      <div className={mainStyle.containerCenterStart}>
        <h1>Please Sign In to View Documentation</h1>
      </div>
    );
  }


  const handleToCClick = (e) => {
    e.preventDefault();
    const targetId = e.target.getAttribute("href").substring(1); // Get the target ID
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const generateTableOfContents = (markdownContent) => {
    const tocItems = [];
    const headings = markdownContent.match(/(#{1,6})\s(.*?)(?=\n|$)/g);

    if (headings) {
      headings.forEach((heading) => {
        const level = heading.match(/^#{1,6}/)[0].length;
        const title = heading.replace(/^#{1,6}\s/, "").trim();
        const id = title.toLowerCase().replace(/\s+/g, "-");
        tocItems.push({ level, title, id });
      });
      setToc(tocItems);
    }
  };

  return (
    <div className={mainStyle.containerCenter}>
      <div className={mainStyle.technicalDocs}>
        {/* Render Table of Contents dynamically */}
        <div style={{ cursor: "pointer" }} onClick={handleToCClick}>
          <ul>
            {toc.map((item) => (
              <li key={item.id}>
                {`${"  ".repeat(item.level - 1)}${item.level === 1 ? "" : " "}`}
                <a href={`#${item.id}`}>{item.title}</a>
              </li>
            ))}
          </ul>
        </div>

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
