"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { generateAnswer, testAnswer } from "../actions";
import { EditorContent, EditorRoot, JSONContent } from "novel"; // TODO
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Generator() {
  const [answer, setAnswer] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // command + enter
    if (e.metaKey && e.key === "Enter") {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setAnswer("");

    try {
      const result = await generateAnswer(input);
      //const result = await testAnswer(input);
      setAnswer(result);
    } catch (error) {
      console.error("Error getting answer:", error);
      setAnswer("Sorry, there was an error processing your request.");
    } finally {
      setIsLoading(false);
    }
    setInput("");
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-5 max-w-4xl mx-auto p-4">
      <div className="w-full flex flex-col gap-5">
        <div ref={responseRef} className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Skeleton className="w-full h-10 animate-pulse" />
            </div>
          ) : answer ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="whitespace-pre-wrap"
            >
              {answer.split("\n").map((line, lineIndex) => (
                <div key={`line-${lineIndex}`}>
                  {line.split(" ").map((word, wordIndex) => (
                    <motion.span
                      key={`${lineIndex}-${wordIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay:
                          (lineIndex * line.split(" ").length + wordIndex) *
                          0.01,
                      }}
                    >
                      {word}{" "}
                    </motion.span>
                  ))}
                </div>
              ))}
            </motion.div>
          ) : (
            <div className="text-gray-400 text-center h-full flex items-center justify-center font-mono text-sm">
              Ask me anything about your trips
            </div>
          )}
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 relative"
          layout
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="I would like to know..."
            className="resize-none font-mono text-sm rounded-xl p-5 pr-24"
            rows={3}
          />
          <div className="absolute bottom-3 right-3">
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin [animation-duration:2s]" />
                  Thinking...
                </>
              ) : (
                "Send ⌘ ↵"
              )}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
