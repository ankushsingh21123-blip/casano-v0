"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Clock, TrendingUp, X } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./SearchBar.module.css";

// --- Types & Mock Data ---
interface Suggestion {
  id: string;
  name: string;
  type: "recent" | "trending" | "product";
  category?: string;
}

const MOCK_SUGGESTIONS: Suggestion[] = [
  { id: "1", name: "Amul Taaza Milk", type: "product", category: "Dairy" },
  { id: "2", name: "Amul Butter 100g", type: "product", category: "Dairy" },
  { id: "3", name: "Amul Masti Curd", type: "product", category: "Dairy" },
  { id: "4", name: "Amul Cheese Slices", type: "product", category: "Dairy" },
];

const RECENT_SEARCHES: Suggestion[] = [
  { id: "r1", name: "milk", type: "recent" },
  { id: "r2", name: "bread", type: "recent" },
];

const TRENDING_SEARCHES: Suggestion[] = [
  { id: "t1", name: "Cold Drinks", type: "trending" },
  { id: "t2", name: "Chips", type: "trending" },
];

// Loader sub-component
const SearchingLoader = () => (
  <div className={`${styles.loaderWrapper} ${styles.loaderComponentWrapper}`}>
    <div className={styles.loader} />
    <div className={styles.letterWrapper}>
      {["S","e","a","r","c","h","i","n","g"].map((letter, i) => (
        <span
          key={i}
          className={styles.loaderLetter}
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          {letter}
        </span>
      ))}
    </div>
  </div>
);

// Main SearchBar component
interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search "milk", "medicines", "pens"...',
  onSearch,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input
  const activeSuggestions = query.length > 0
    ? MOCK_SUGGESTIONS.filter(s => s.name.toLowerCase().includes(query.toLowerCase()))
    : [...RECENT_SEARCHES, ...TRENDING_SEARCHES];

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsFocused(true);
  };

  const handeSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setIsFocused(false);
    if (onSearch) onSearch(suggestion);
    // Add real navigation if needed, e.g., router.push(`/search?q=${suggestion}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsFocused(false);
      if (onSearch) onSearch(query);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setIsFocused(true); // Keep focus to show recents
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className={`${styles.searchWrapper} ${isFocused ? styles.searchWrapperFocused : ''}`}>
        <Search className={styles.searchIcon} strokeWidth={2.5} />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className={styles.searchInput}
          aria-label="Search"
        />
        {query && (
          <button onClick={clearSearch} className="mr-2 text-gray-400 hover:text-gray-600">
             <X className="w-4 h-4" />
          </button>
        )}
        <SearchingLoader />
      </div>

      {/* --- Search Suggestions Dropdown Overlay --- */}
      {isFocused && (query.length > 0 || activeSuggestions.length > 0) && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-gray-800 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {!query && (
            <div className="px-4 pb-2 mb-2 border-b border-gray-50 dark:border-gray-800">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recent & Trending</h3>
            </div>
          )}

          <div className="max-h-[350px] overflow-y-auto">
            {activeSuggestions.length > 0 ? (
              activeSuggestions.map((item, idx) => (
                <button
                  key={`${item.id}-${idx}`}
                  onClick={() => handeSuggestionClick(item.name)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#252525] flex items-center gap-3 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-[#2a2a2a] flex items-center justify-center">
                    {item.type === 'recent' && <Clock className="w-4 h-4 text-gray-500" />}
                    {item.type === 'trending' && <TrendingUp className="w-4 h-4 text-brand-orange" />}
                    {item.type === 'product' && <Search className="w-4 h-4 text-brand-green" />}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{item.name}</span>
                    {item.category && <span className="text-[11px] text-gray-400 font-medium">in {item.category}</span>}
                  </div>
                </button>
              ))
            ) : (
                <div className="px-5 py-6 text-center text-sm text-gray-500">
                  <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  No results found for &quot;{query}&quot;
                </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default SearchBar;
