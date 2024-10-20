import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 5px 10px;
    width: 300px;
    background-color: #fff;
`;

const SearchInput = styled.input`
    border: none;
    outline: none;
    flex: 1;
    padding-left: 10px;
    font-size: 16px;
`;

const SearchIcon = styled(FaSearch)`
    color: #888;
    font-size: 16px;
`;

interface SearchComponentProps {
    placeholder?: string;
    onSearch?: (query: string) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ placeholder = "Search user...", onSearch }) => {
    const [query, setQuery] = useState<string>('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        if (onSearch) {
            onSearch(value); // Trigger the callback with the updated value
        }
    };

    return (
        <SearchContainer>
            <SearchIcon />
            <SearchInput 
                type="text" 
                placeholder={placeholder} 
                value={query} 
                onChange={handleInputChange} 
            />
        </SearchContainer>
    );
};

export default SearchComponent;
