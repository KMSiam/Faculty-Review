import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { universities } from '../utils/universities';
import clsx from 'clsx';

const UniversityAutocomplete = ({ value, onChange, placeholder = "Search university...", required = true, name = "university" }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [inputValue, setInputValue] = useState(value || '');
    const wrapperRef = useRef(null);

    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputValue(val);
        onChange(val);

        if (val.length > 0) {
            const filtered = universities.filter(u =>
                u.toLowerCase().includes(val.toLowerCase())
            ).slice(0, 8);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (suggestion) => {
        setInputValue(suggestion);
        onChange(suggestion);
        setShowSuggestions(false);
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <input
                type="text"
                name={name}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => {
                    if (inputValue.length > 0) {
                        const filtered = universities.filter(u =>
                            u.toLowerCase().includes(inputValue.toLowerCase())
                        ).slice(0, 8);
                        setSuggestions(filtered);
                        setShowSuggestions(true);
                    }
                }}
                className="input-field pl-11 w-full"
                placeholder={placeholder}
                required={required}
            />
            {inputValue && (
                <button
                    type="button"
                    onClick={() => { setInputValue(''); onChange(''); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-[100] w-full mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-fade-in divide-y divide-slate-800">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => selectSuggestion(suggestion)}
                            className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-primary-500/10 hover:text-white transition-colors flex items-center gap-3"
                        >
                            <Search className="w-3.5 h-3.5 text-primary-500" />
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UniversityAutocomplete;
