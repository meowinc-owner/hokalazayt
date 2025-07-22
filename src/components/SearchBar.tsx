import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ onSearch, placeholder = "Search videos..." }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative">
          <Search 
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
              isFocused ? 'text-primary animate-blur-out' : 'text-muted-foreground'
            }`} 
          />
          
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="pl-12 pr-12 h-14 text-lg bg-card/50 backdrop-blur-sm border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 hover:bg-card/70 focus:shadow-lg focus:shadow-primary/20"
          />
          
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-110"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {isFocused && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/20 rounded-xl blur-xl -z-10 animate-glow-pulse" />
        )}
      </form>
    </div>
  );
};