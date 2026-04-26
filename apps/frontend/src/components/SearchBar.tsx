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
    router.push(`/products?search=${encodeURIComponent(suggestion)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      setIsFocused(false);
      if (onSearch) onSearch(query);
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
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
        {/* Removed infinite spinner — search now navigates to /products */}
      </div>

      {/* --- Search Suggestions Dropdown Overlay --- */}
      {isFocused && (query.length > 0 || activeSuggestions.length > 0) && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full rounded-2xl py-3 z-50" style={{ background: "#1a1714", border: "1px solid #2e2a25", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}>
          
          {!query && (
            <div className="px-4 pb-2 mb-2" style={{ borderBottom: "1px solid #2e2a25" }}>
               <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#6b6560" }}>Recent & Trending</h3>
            </div>
          )}

          <div className="max-h-[350px] overflow-y-auto">
            {activeSuggestions.length > 0 ? (
              activeSuggestions.map((item, idx) => (
                <button
                  key={`${item.id}-${idx}`}
                  onClick={() => handeSuggestionClick(item.name)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors"
                  style={{ color: "#e8e0d4" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#252017"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#252017" }}>
                    {item.type === 'recent' && <Clock className="w-4 h-4" style={{ color: "#6b6560" }} />}
                    {item.type === 'trending' && <TrendingUp className="w-4 h-4" style={{ color: "#B8962E" }} />}
                    {item.type === 'product' && <Search className="w-4 h-4" style={{ color: "#C1492E" }} />}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-semibold truncate" style={{ color: "#e8e0d4" }}>{item.name}</span>
                    {item.category && <span className="text-[11px] font-medium" style={{ color: "#6b6560" }}>in {item.category}</span>}
                  </div>
                </button>
              ))
            ) : (
                <div className="px-5 py-6 text-center text-sm" style={{ color: "#6b6560" }}>
                  <Search className="w-8 h-8 mx-auto mb-2" style={{ color: "#3a3530" }} />
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
