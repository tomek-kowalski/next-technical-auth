import { useEffect } from "react";

export default function TableOfContents() {
  useEffect(() => {
    console.log('it is loaded' );
    const handleClick = (e) => {
      e.preventDefault();

      const targetId = e.target.getAttribute("href").substring(1);
      console.log(targetId );
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    const addClickListeners = () => {
      const tableOfContents = Array.from(document.querySelectorAll("table th"))
        .find(th => th.innerText.trim() === "Table of Contents");

      if (tableOfContents) {
        const tocLinks = tableOfContents.closest("table").querySelectorAll("td a[href^='#']");
        
        tocLinks.forEach(link => {
          link.addEventListener("click", handleClick);
        });
        
        return () => {
          tocLinks.forEach(link => {
            link.removeEventListener("click", handleClick);
          });
        };
      }
    };

 
    const cleanup = addClickListeners();


    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return null;
}
