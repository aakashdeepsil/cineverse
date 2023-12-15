"use client";

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { cp } from 'fs';

interface SearchProps {
    placeholder: string;
}

export default function SearchBar({ placeholder }: SearchProps) {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleInputSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            // Prevent the default action
            event.preventDefault();

            console.log('Sending search value to backend...');
            console.log(searchValue);
    
            // Send the search value to the backend
            const response = await fetch('http://localhost:8080/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ search: searchValue })
            });
    
            if (!response.ok) {
                // Handle error
                console.error('Failed to send search value to backend');
                return;
            }
    
            // Handle response
            const data = await response.json();
            console.log(data["hits"]["hits"]);
            setSearchResults(data["hits"]["hits"]);
            console.log('Received response from backend');
            console.log(searchResults)

        }
    };

    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">
                Search
            </label>
            <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                placeholder={placeholder}
                value={searchValue}
                onChange={handleInputChange}
                onKeyDown={handleInputSubmit}
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            {searchResults && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                    <ul className="divide-y divide-gray-200">
                        {searchResults.map((result: any) => (
                            <li key={result._id} className="px-6 py-4 hover:bg-gray-50">
                                <a href="#" className="block text-sm font-medium text-gray-900">
                                    {result._source.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>  
            )}
        </div>
    );
}