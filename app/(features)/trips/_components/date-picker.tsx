"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface DatePickerProps {
  label: string;
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: (date: Date) => boolean;
  error?: string | null;
  required?: boolean;
  startDate?: Date;
  endDate?: Date;
  isEndDate?: boolean;
}

export default function DatePicker({
  label,
  selected,
  onSelect,
  placeholder = "Pick a date",
  disabled = () => false,
  error = null,
  required = false,
  startDate,
  endDate,
  isEndDate,
}: DatePickerProps) {
  return (
    <div className="flex flex-col w-full">
      <Label htmlFor={label} className="mb-2 flex items-center">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selected && "text-muted-foreground",
              !selected && error && "border-red-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected ? (
              format(selected, "PPP")
            ) : (
              <span className="font-mono">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" side="top" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={onSelect}
            disabled={disabled}
            initialFocus
            modifiers={{
              selected: selected ? [selected] : [],
              startDate: startDate ? [startDate] : [],
              range:
                startDate && endDate
                  ? [
                      {
                        from: new Date(startDate.getTime() + 86400000),
                        to: new Date(endDate.getTime() - 86400000),
                      },
                    ]
                  : [],
            }}
            modifiersStyles={{
              startDate: {
                backgroundColor: "var(--accent)",
                color: "white",
              },
              range: {
                backgroundColor: "var(--accent-light)",
                color: "var(--accent-foreground)",
              },
              selected: {
                backgroundColor: "var(--accent)",
                color: "white",
              },
            }}
          />
        </PopoverContent>
      </Popover>
      {error && !selected && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
