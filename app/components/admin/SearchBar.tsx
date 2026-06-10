"use client";

import { Search, X } from "lucide-react";
import { useState, useCallback } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
}

export default function SearchBar({ 
  placeholder = "Search...", 
  onSearch,
  debounceMs = 300
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (timeoutId) clearTimeout(timeoutId);
    
    const newTimeoutId = setTimeout(() => {
      onSearch(value);
    }, debounceMs);
    
    setTimeoutId(newTimeoutId);
  }, [onSearch, debounceMs, timeoutId]);

  const handleClear = useCallback(() => {
    setQuery("");
    onSearch("");
  }, [onSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
