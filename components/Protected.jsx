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
        .then((data) => {
          console.log("Fetched content:", data.content);
          setContent(data.content);
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

  // Handle clicks from Table of Contents links
  const handleToCClick = (e) => {
    e.preventDefault();
    console.log("ToC link clicked:", e.target);

    const targetText = e.target.innerText;
    const contentDiv = contentRef.current;

    if (contentDiv) {
      const matchingElement = Array.from(contentDiv.querySelectorAll("h1, h2, h3, h4, h5, h6, p"))
        .find(el => el.innerText.trim() === targetText.trim());

      if (matchingElement) {
        console.log("Found matching element:", matchingElement);
        matchingElement.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.log("No matching element found for:", targetText);
      }
    }
  };

  // Generate the Table of Contents based on markdown
  const generateTableOfContents = (markdown) => {
    console.log("Generating Table of Contents for markdown:", markdown);
    const headers = [];
    let currentNumber = [];

    markdown.split("\n").forEach(line => {
      const match = line.match(/^(#+)\s*(.*)/);
      if (match) {
        const level = match[1].length; // Number of "#" determines level
        const title = match[2].trim();

        // Update numbering based on level
        currentNumber = currentNumber.slice(0, level - 1);
        currentNumber.push(currentNumber.length + 1);

        const tocNumber = currentNumber.join(".");

        headers.push({ level, title, tocNumber });
      }
    });

    const tocTable = `
      <table>
        <thead>
          <tr><th>Table of Contents</th></tr>
        </thead>
        <tbody>
          ${headers
            .map(
              ({ tocNumber, title }) => `
                <tr>
                  <td>${tocNumber} <a href="#${title.toLowerCase().replace(/\s+/g, '-')}">${title}</a></td>
                </tr>`
            )
            .join('')}
        </tbody>
      </table>
    `;
    console.log("Generated ToC:", tocTable);
    return tocTable;
  };

  // Insert the ToC table where the markdown table exists
  const insertTableOfContents = (markdown) => {
    console.log("Inserting ToC into markdown:", markdown);
    const tableMatch = markdown.match(/<table.*?<\/table>/);
    if (tableMatch) {
      console.log("Table found in markdown, replacing it with ToC...");
      return markdown.replace(tableMatch[0], generateTableOfContents(markdown));
    }
    console.log("No table found in markdown, returning as is.");
    return markdown;
  };

  const contentWithToc = insertTableOfContents(content);
  console.log("Content with Table of Contents inserted:", contentWithToc);

  return (
    <div className={mainStyle.containerCenter}>
      <div className={mainStyle.technicalDocs}>
        {/* Render the content with replaced table with Table of Contents */}
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
            {contentWithToc}
          </ReactMarkdown>
        </div>

        {/* Handle ToC click after rendering */}
        <div
          dangerouslySetInnerHTML={{
            __html: contentWithToc,
          }}
          onClick={handleToCClick} // Attach the click handler to the entire ToC
        />
      </div>
    </div>
  );
}
