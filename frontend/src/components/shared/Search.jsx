import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

const Search = ({ onSearch, placeholder = 'Search...', initialValue = '' }) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        const handler = setTimeout(() => {
            onSearch(value);
        }, 500); // 500ms debounce

        return () => {
            clearTimeout(handler);
        };
    }, [value, onSearch]);

    return (
        <div className="relative group max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <SearchIcon size={18} />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-10 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-sm placeholder:text-slate-400"
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            {value && (
                <button
                    onClick={() => setValue('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

export default Search;
