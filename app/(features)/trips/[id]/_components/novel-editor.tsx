"use client";

import { EditorContent, EditorRoot, JSONContent } from "novel";
import { useState, useEffect, useRef } from "react";
import { defaultExtensions } from "@/lib/editor/extensions";
import { useParams } from "next/navigation";
import {
  getTripNotes,
  updateNoteAction,
  createNoteAction,
} from "@/app/actions";
import { debounce } from "lodash";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function NoteEditor() {
  const params = useParams();
  const tripId = params.id as string;
  const [content, setContent] = useState<JSONContent | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const editorInitialized = useRef(false);

  useEffect(() => {
    const loadNotes = async () => {
      setIsLoading(true);
      try {
        const notes = await getTripNotes(tripId);

        if (notes && notes.length > 0) {
          setContent(notes[0].contenido);
          setNoteId(notes[0].id);
          console.log("Loaded existing note:", notes[0].id);
        } else {
          const newNote = await createNoteAction(undefined, tripId);
          if (newNote && newNote.id) {
            setContent(newNote.contenido);
            setNoteId(newNote.id);
            console.log("Created new note:", newNote.id);
          }
        }
      } catch (error) {
        console.error("Error loading notes:", error);
      } finally {
        setIsLoading(false);
        editorInitialized.current = true;
      }
    };

    if (!editorInitialized.current) {
      loadNotes();
    }
  }, [tripId]);

  const debouncedSave = debounce(async (content: JSONContent) => {
    if (!noteId) return;

    try {
      setIsSaving(true);
      const jsonContent = JSON.parse(JSON.stringify(content));
      await updateNoteAction(noteId, jsonContent);
    } catch (error) {
      console.error("Error saving notes:", error);
    } finally {
      setIsSaving(false);
    }
  }, 1000);

  if (isLoading) {
    return (
      <div className="w-full max-w-screen-md flex flex-col gap-6">
        <div className="flex flex-col gap-1 max-w-full">
          <Skeleton className="h-8 w-3/4" />
          <div className="w-full">
            <Skeleton className="h-20 w-full mt-2" />
          </div>
        </div>

        <div className="flex flex-row flex-wrap gap-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-40" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
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
            debouncedSave(json);
          }}
        />
      </EditorRoot>
      {isSaving && (
        <div className="absolute bottom-2 right-2 bg-background/80 p-1.5 rounded-full shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
