"use client";

import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trash } from "lucide-react";
import { useState } from "react";
import { removeTripAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TripCardProps {
  id: string;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  created_at: string;
  updated_at: string;
  localizacion: {
    id: string;
    nombre: string;
    latitud: number;
    longitud: number;
  };
}

export default function TripCard({
  id,
  nombre,
  descripcion,
  fecha_inicio,
  fecha_fin,
  localizacion,
}: TripCardProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const formattedStartDate = fecha_inicio
    ? format(new Date(fecha_inicio), "dd/MM/yyyy")
    : "Not specified";

  const formattedEndDate = fecha_fin
    ? format(new Date(fecha_fin), "dd/MM/yyyy")
    : "Not specified";

  const handleCardClick = (e: React.MouseEvent) => {
    if (!showDeleteAlert) {
      router.push(`/trips/${id}`);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await removeTripAction(id);

      if (result?.error) {
        toast.error(`Failed to delete trip: ${result.error}`);
      } else {
        toast.success(`Trip "${nombre}" deleted successfully!`);
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Failed to delete trip. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteAlert(false);
    }
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card
            className="hover:border-[var(--accent)] transition-colors duration-200 ease-in-out cursor-pointer flex flex-col h-full"
            onClick={handleCardClick}
          >
            <CardHeader>
              <div className="flex flex-col gap-2">
                <span className="text-gray-900 font-mono font-medium text-lg">
                  {nombre}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-gray-500 text-sm font-mono break-words">
                  {(descripcion && descripcion.length > 70
                    ? `${descripcion.substring(0, 70)}...`
                    : descripcion) || "No description provided"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="mt-auto">
              <div className="flex flex-col gap-2 mb-2">
                <span className="text-gray-700 font-mono text-xs">To:</span>
                <span className="text-gray-700 font-mono font-bold text-sm">
                  {localizacion?.nombre || "Not specified"}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-gray-700 font-mono text-xs">
                  Duration:
                </span>
                <span className="text-gray-700 font-mono font-bold text-sm">
                  {formattedStartDate} - {formattedEndDate}
                </span>
              </div>
            </CardContent>
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            className="text-red-600 focus:text-red-600 flex items-center gap-2 hover:cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDeleteAlert(true);
            }}
          >
            <Trash className="h-4 w-4" />
            Delete Trip
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the trip "{nombre}" and all
              associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
