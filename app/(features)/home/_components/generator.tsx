"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { generateAnswer } from "../actions";
import { EditorContent, EditorRoot, JSONContent } from "novel";

export default function Generator() {
  const [answer, setAnswer] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setAnswer("");

    try {
      const result = await generateAnswer(input);
      setAnswer(result);
    } catch (error) {
      console.error("Error getting answer:", error);
      setAnswer("Sorry, there was an error processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-5 max-w-4xl mx-auto p-4">
      <div className="w-full flex flex-col gap-5">
        <div ref={responseRef} className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : answer ? (
            <div className="whitespace-pre-wrap">{answer}</div>
          ) : (
            <div className="text-gray-400 text-center h-full flex items-center justify-center">
              Ask a question to get started
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything about your trips..."
            className="resize-none"
            rows={3}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="self-end"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Thinking...
              </>
            ) : (
              "Send"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
