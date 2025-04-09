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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setAnswer("");

    try {
      //const result = await generateAnswer(input);
      const result = await generateAnswer(input);
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
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="whitespace-pre-wrap"
            >
              {answer}
            </motion.div>
          ) : (
            <div className="text-gray-400 text-center h-full flex items-center justify-center font-mono text-sm">
              Ask me anything about your trips
            </div>
          )}
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
          layout
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="I would like to know..."
            className="resize-none font-mono text-sm"
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
        </motion.form>
      </div>
    </div>
  );
}
