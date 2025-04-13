import { getTripAction } from "@/app/actions";
import { format } from "date-fns";

import { MapPin, Calendar } from "lucide-react";
import NewExpenseButton from "./_components/new-expense-creator";
import NoteEditor from "./_components/novel-editor";

export default async function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const trip = await getTripAction(resolvedParams.id);

  if (!resolvedParams.id) {
    return (
      <div className="text-center py-4 text-red-500 text-sm">
        Error: Trip id not found
      </div>
    );
  }

  const formattedStartDate = trip.fecha_inicio
    ? format(new Date(trip.fecha_inicio), "dd/MM/yyyy")
    : "Not specified";

  const formattedEndDate = trip.fecha_fin
    ? format(new Date(trip.fecha_fin), "dd/MM/yyyy")
    : "Not specified";

  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="w-full flex flex-col border rounded-lg gap-10 p-4">
        <div className="flex flex-col gap-1 max-w-full">
          <h1 className="text-xl font-mono truncate">{trip.nombre}</h1>
          <div className="w-full">
            <p
              className="text-muted-foreground text-sm font-mono break-words hyphens-auto"
              style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
            >
              {trip.descripcion}
            </p>
          </div>
        </div>

        <div className="flex flex-row flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">
              {trip.localizacion.nombre}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formattedStartDate} - {formattedEndDate}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <NoteEditor />
      </div>
    </div>
  );
}
