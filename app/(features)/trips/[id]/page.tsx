import { getTripAction } from "@/app/actions";
import { format } from "date-fns";
export default async function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const trip = await getTripAction(resolvedParams.id);

  if (!resolvedParams.id) {
    return <div>Error: Trip id not found</div>;
  }

  const formattedStartDate = trip.fecha_inicio
    ? format(new Date(trip.fecha_inicio), "dd/MM/yyyy")
    : "Not specified";

  const formattedEndDate = trip.fecha_fin
    ? format(new Date(trip.fecha_fin), "dd/MM/yyyy")
    : "Not specified";

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <div>
          <span className="font-mono text-xs text-grey-600">Trip to: </span>
          <span>{trip.localizacion.nombre}</span>
        </div>
        <span>
          {formattedStartDate} - {formattedEndDate}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-2xl font-mono">{trip.nombre}</span>
        <span className="text-gray-500 text-lg font-mono">
          {trip.descripcion}
        </span>
      </div>
    </div>
  );
}
