import fs from "node:fs/promises";
import path from "node:path";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function Page() {
  // Resolve path to repo root README.md from the web app directory
  const readmePath = path.join(process.cwd(), "..", "..", "README.md");
  let content: string;
  try {
    content = await fs.readFile(readmePath, "utf8");
  } catch (_) {
    content = "# README not found\n\nCould not load the repository README.md.";
  }

  return (
    <main className="container mx-auto max-w-3xl px-6 py-10">
      {/* Avido icon displayed at the top of the main page */}
      <div className="flex justify-center mb-8">
        <Image
          src="/AvidoIcon.png"
          alt="Avido icon"
          width={80}
          height={80}
          className="rounded-md shadow-sm"
          priority
        />
      </div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => (
            <h1 className="text-3xl font-bold tracking-tight mb-6" {...props} />
          ),
          h2: (props) => (
            <h2 className="text-2xl font-semibold tracking-tight mt-10 mb-4" {...props} />
          ),
          h3: (props) => (
            <h3 className="text-xl font-semibold mt-8 mb-3" {...props} />
          ),
          p: (props) => <p className="leading-7 my-4" {...props} />,
          ul: (props) => <ul className="list-disc pl-6 my-4 space-y-1" {...props} />,
          ol: (props) => <ol className="list-decimal pl-6 my-4 space-y-1" {...props} />,
          li: (props) => <li className="leading-7" {...props} />,
          code: (props) =>
            <code className={"font-mono text-sm"} {...props} />,
          pre: (props) => (
            <pre className="bg-muted p-4 rounded-md overflow-x-auto my-4" {...props} />
          ),
          a: (props) => (
            <a className="text-primary underline underline-offset-4" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </main>
  );
}