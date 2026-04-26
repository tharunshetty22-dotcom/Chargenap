'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { searchLocations } from '@/lib/api';
import type { GeoLocation } from '@/lib/types';

interface SearchBarProps {
  onSelect: (location: GeoLocation) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await searchLocations(q);
      setResults(data);
      setOpen(true);
      setFocusedIndex(-1);
    } catch {
      setError('Search failed. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (loc: GeoLocation) => {
    setQuery('');
    setResults([]);
    setOpen(false);
    onSelect(loc);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[focusedIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const formatLocation = (loc: GeoLocation) => {
    const parts = [loc.name];
    if (loc.admin1) parts.push(loc.admin1);
    parts.push(loc.country);
    return parts.join(', ');
  };

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <input
        className="search-input"
        type="text"
        placeholder="Search city..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setOpen(true)}
        aria-label="Search city"
        aria-autocomplete="list"
        aria-expanded={open}
      />
      {loading && <span className="search-spinner" aria-hidden="true" />}
      {error && !loading && (
        <div className="error-message" style={{ marginTop: 8 }}>{error}</div>
      )}
      {open && results.length > 0 && (
        <div className="search-dropdown" role="listbox">
          {results.map((loc, i) => (
            <button
              key={loc.id}
              className={`search-item${i === focusedIndex ? ' focused' : ''}`}
              role="option"
              aria-selected={i === focusedIndex}
              onClick={() => handleSelect(loc)}
              onMouseEnter={() => setFocusedIndex(i)}
            >
              {formatLocation(loc)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
