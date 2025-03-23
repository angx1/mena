"use client";

import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TripCardProps {
  id: string;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  created_at: string;
  updated_at: string;
}

export default function TripCard({
  id,
  nombre,
  descripcion,
  fecha_inicio,
  fecha_fin,
}: TripCardProps) {
  const formattedStartDate = fecha_inicio
    ? format(new Date(fecha_inicio), "dd/MM/yyyy")
    : "Not specified";

  const formattedEndDate = fecha_fin
    ? format(new Date(fecha_fin), "dd/MM/yyyy")
    : "Not specified";

  return (
    <Card className="hover:border-[var(--accent)] transition-colors duration-200 ease-in-out cursor-pointer">
      <CardHeader>
        <Badge className="bg-gray-100 text-gray-800 w-fit hover:text-white mb-2">
          id: {id.substring(0, 8)}
        </Badge>
        <div className="flex flex-col gap-2">
          <span className="text-gray-900 font-mono font-medium text-lg">
            {nombre}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-gray-500 text-sm font-mono">
            {descripcion || "No description provided"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-gray-700 font-mono text-xs">To:</span>
          <span className="text-gray-700 font-mono text-sm">
            location to be implemented
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-gray-700 font-mono text-xs">Duraction:</span>
          <span className="text-gray-700 font-mono text-sm">
            {formattedStartDate} - {formattedEndDate}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
