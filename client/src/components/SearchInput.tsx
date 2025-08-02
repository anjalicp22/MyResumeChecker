import React from "react";

interface Props {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchInput: React.FC<Props> = ({ searchTerm, setSearchTerm }) => (
  <input
    type="text"
    placeholder=" Search saved applications..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 ring-indigo-400 text-sm shadow"
  />
);

export default SearchInput;
