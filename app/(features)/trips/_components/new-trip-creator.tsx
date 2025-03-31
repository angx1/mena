"use client";

import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { createTripAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState, useRef } from "react";
import LocationPicker from "./location-picker";
import DatePicker from "./date-picker";

export default function NewTripButton() {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [formError, setFormError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<{
    lat: string;
    lon: string;
  } | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [locationError, setLocationError] = useState<string | null>(null);

  const currentDate = new Date();

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (endDate && date && endDate < date) {
      setEndDate(undefined);
    }
    if (date) setFormError(null);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date) setFormError(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    setOpen(newOpen);
  };

  const handleSubmit = async (formData: FormData) => {
    let hasError = false;

    if (!startDate) {
      setFormError("Please select a start date");
      hasError = true;
    }

    if (!endDate) {
      setFormError("Please select an end date");
      hasError = true;
    }

    if (!locationData) {
      setLocationError("Please select a location");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const tripData: {
      name: string;
      startDate: Date | undefined;
      endDate: Date | undefined;
      description: string;
      location: {
        name: string;
        latitude: number;
        longitude: number;
      };
    } = {
      name: String(formData.get("tripName")),
      startDate: startDate,
      endDate: endDate,
      description: String(formData.get("description")),
      location: {
        name: selectedLocation || "Unknown location",
        latitude: locationData ? parseFloat(locationData.lat) : 0,
        longitude: locationData ? parseFloat(locationData.lon) : 0,
      },
    };

    try {
      const result = await createTripAction(tripData);

      if (result?.error) {
        toast.error(`Failed to create trip: ${result.error}`);
      } else {
        toast.success(`Trip "${tripData.name}" created successfully!`);
        resetForm();
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating trip:", error);
      toast.error("Failed to create trip. Please try again.");
    }
  };

  const resetForm = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setFormError(null);
    setLocationError(null);
    setSelectedLocation(null);
    setLocationData(null);
    setResetKey((prev) => prev + 1);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location.display_name);
    setLocationData({ lat: location.lat, lon: location.lon });
    setLocationError(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <CirclePlus className="mr-2 h-4 w-4" />
          new trip
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Your new Trip</DialogTitle>
        <DialogDescription className="font-mono mb-5">
          Fill up this information to register your new trip
        </DialogDescription>
        <form ref={formRef} className="flex-1 flex flex-col min-w-64 gap-4">
          <LocationPicker
            onLocationSelect={handleLocationSelect}
            selectedLocation={selectedLocation}
            resetKey={resetKey}
            error={locationError}
            required={true}
          />

          <div className="flex flex-row gap-3 justify-between mb-3">
            <DatePicker
              label="Start date"
              selected={startDate}
              onSelect={handleStartDateChange}
              disabled={(date) => date < currentDate}
              error={formError}
              required={true}
              startDate={startDate}
              endDate={endDate}
            />

            <DatePicker
              label="End date"
              selected={endDate}
              onSelect={handleEndDateChange}
              disabled={(date) =>
                startDate ? date < startDate : date < currentDate
              }
              error={formError}
              required={true}
              startDate={startDate}
              endDate={endDate}
              isEndDate={true}
            />
          </div>
          <div className="space-y-2 mb-3">
            <Label htmlFor="tripName">Trip title</Label>
            <Input id="tripName" name="tripName" />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Trip description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition"
            ></textarea>
          </div>
          <SubmitButton
            pendingText="Creating trip..."
            formAction={handleSubmit}
            className="mt-7"
          >
            Create trip
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
