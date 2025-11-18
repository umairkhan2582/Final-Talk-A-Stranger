import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LocationSearchProps {
  placeholder?: string;
  onSearchChange: (query: string) => void;
  resultsCount?: number;
}

export default function LocationSearch({ 
  placeholder = "Search locations...", 
  onSearchChange,
  resultsCount
}: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearchChange("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10 h-12 text-lg"
          data-testid="input-location-search"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2"
            data-testid="button-clear-search"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      {resultsCount !== undefined && searchQuery && (
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Found {resultsCount} {resultsCount === 1 ? 'location' : 'locations'}
        </p>
      )}
    </div>
  );
}
