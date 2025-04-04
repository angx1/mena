"use client";

import { EditorContent, EditorRoot, JSONContent } from "novel";
import { useState, useEffect } from "react";
import { defaultExtensions } from "@/lib/editor/extensions";
import { useParams } from "next/navigation";
import { getTripNotes } from "@/app/actions";

export default function NoteEditor() {
  const params = useParams();
  const tripId = params.id as string;
  const [content, setContent] = useState<JSONContent | undefined>(undefined);

  useEffect(() => {
    const fetchNotes = async () => {
      const json = await getTripNotes(tripId);
      if (json) {
        setContent(json);
      }
    };

    fetchNotes();
  }, [tripId]);

  return (
    <EditorRoot>
      <EditorContent
        extensions={defaultExtensions}
        editorProps={{
          attributes: {
            class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default text-sm focus:outline-none max-w-full`,
          },
        }}
        initialContent={content}
        onUpdate={({ editor }) => {
          const json = editor.getJSON();
          setContent(json);
        }}
      />
    </EditorRoot>
  );
}
