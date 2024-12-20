import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface AsciiOutputProps {
  asciiArt: string;
}

export function AsciiOutput({ asciiArt }: AsciiOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(asciiArt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-gray-700">
          Generated ASCII Art
        </h3>
        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            copied
              ? "bg-green-500 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy ASCII
            </>
          )}
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg overflow-auto max-h-96 shadow-inner">
        <pre className="whitespace-pre font-mono text-xs leading-none select-all">
          {asciiArt}
        </pre>
      </div>
    </div>
  );
}
