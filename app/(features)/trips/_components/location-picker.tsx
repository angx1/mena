"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface LocationPickerProps {
  onLocationSelect: (location: {
    display_name: string;
    lat: string;
    lon: string;
  }) => void;
  selectedLocation?: string | null;
  resetKey?: number;
  error?: string | null;
  required?: boolean;
}

export default function LocationPicker({
  onLocationSelect,
  selectedLocation = null,
  resetKey = 0,
  error = null,
  required = false,
}: LocationPickerProps) {
  const [locationQuery, setLocationQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setLocationQuery("");
    setSearchResults([]);
  }, [resetKey]);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (locationQuery.trim().length < 3) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}&limit=5`
        );
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error searching location:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [locationQuery]);

  const handleLocationSelect = (location: any) => {
    setLocationQuery(location.display_name);
    setSearchResults([]);
    onLocationSelect(location);
  };

  return (
    <div className="space-y-2 mb-3">
      <Label htmlFor="location" className="flex items-center">
        Where are you traveling to?{" "}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        <div className="flex items-center">
          <Input
            id="location"
            name="location"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder="Search for a location"
            className={`w-full pr-8 placeholder:font-mono ${!selectedLocation && error ? "border-red-500" : ""}`}
          />
          {isSearching && (
            <div className="absolute right-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
            </div>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => handleLocationSelect(result)}
              >
                {result.display_name}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && !selectedLocation && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
