import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X, Filter, ArrowRight } from 'lucide-react';
import { searchTroubleshootingContent } from '@/utils/troubleshootingUtils';
import { PLATFORMS, DIFFICULTY_LEVELS, DEVICE_TYPES } from '@/types/troubleshootingTypes';

/**
 * Content search component with real-time search capabilities
 * Allows filtering by platform, device type, and difficulty level
 */
const ContentSearch = ({ onResultClick, className }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    platform: '',
    deviceType: '',
    difficulty: '',
    minSuccessRate: 0
  });
  const [recentSearches, setRecentSearches] = useState([]);
  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (value.trim().length > 2) {
      setIsSearching(true);
      
      // Set new timeout for debounce
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(value);
      }, 300);
    } else if (value.trim().length === 0) {
      setResults(null);
      setIsSearching(false);
    }
  };

  // Perform search with current query and filters
  const performSearch = (searchQuery = query) => {
    if (searchQuery.trim().length > 2) {
      const searchResults = searchTroubleshootingContent(searchQuery, filters);
      setResults(searchResults);
      setIsSearching(false);
      
      // Add to recent searches if not already present
      if (!recentSearches.includes(searchQuery.trim())) {
        setRecentSearches(prev => [searchQuery.trim(), ...prev.slice(0, 4)]);
      }
    }
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      platform: '',
      deviceType: '',
      difficulty: '',
      minSuccessRate: 0
    });
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults(null);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Apply filters when they change
  useEffect(() => {
    if (query.trim().length > 2) {
      performSearch();
    }
  }, [filters]);

  // Handle result click
  const handleResultClick = (resultType, result) => {
    if (onResultClick) {
      onResultClick(resultType, result);
    }
  };

  // Highlight matching text in search results
  const highlightMatch = (text, searchQuery) => {
    if (!searchQuery.trim() || !text) return text;
    
    const regex = new RegExp(`(${searchQuery.trim()})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? <mark key={index} className="bg-yellow-200">{part}</mark> : part
    );
  };

  return (
    <div className={`w-full ${className || ''}`}>
      <form onSubmit={handleSearchSubmit} className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Search for USB troubleshooting solutions..."
          value={query}
          onChange={handleSearchChange}
          className="pl-10 pr-16"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
            Object.values(filters).some(v => v) ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          <Filter size={18} />
        </Button>
      </form>

      {showFilters && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>Search Filters</span>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Platform</label>
                <select
                  value={filters.platform}
                  onChange={(e) => handleFilterChange('platform', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Platforms</option>
                  {Object.values(PLATFORMS).map(platform => (
                    <option key={platform} value={platform}>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Device Type</label>
                <select
                  value={filters.deviceType}
                  onChange={(e) => handleFilterChange('deviceType', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Devices</option>
                  {Object.values(DEVICE_TYPES).map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Difficulty</label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Any Difficulty</option>
                  {Object.values(DIFFICULTY_LEVELS).map(level => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Min. Success Rate</label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={filters.minSuccessRate}
                    onChange={(e) => handleFilterChange('minSuccessRate', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="ml-2 text-sm">{filters.minSuccessRate}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isSearching && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2 text-gray-600">Searching...</p>
        </div>
      )}

      {results && (
        <div className="space-y-6">
          <div className="text-sm text-gray-500">
            Found {results.totalResults} results for "{query}"
          </div>

          {results.quickSolutions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Quick Solutions</h3>
              <div className="space-y-2">
                {results.quickSolutions.map(solution => (
                  <div
                    key={solution.id}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleResultClick('quickSolution', solution)}
                  >
                    <div className="font-medium">{highlightMatch(solution.title, query)}</div>
                    <p className="text-sm text-gray-600 mt-1">
                      {highlightMatch(solution.description, query)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {solution.successRate}% Success
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {solution.difficulty}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.platformSolutions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Platform-Specific Solutions</h3>
              <div className="space-y-2">
                {results.platformSolutions.map(solution => (
                  <div
                    key={solution.id}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleResultClick('platformSolution', solution)}
                  >
                    <div className="flex justify-between">
                      <div className="font-medium">{highlightMatch(solution.title, query)}</div>
                      <Badge>{solution.platform}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {highlightMatch(solution.description, query)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.faq.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Frequently Asked Questions</h3>
              <div className="space-y-2">
                {results.faq.map(faq => (
                  <div
                    key={faq.id}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleResultClick('faq', faq)}
                  >
                    <div className="font-medium">{highlightMatch(faq.question, query)}</div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {highlightMatch(faq.answer, query)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.totalResults === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No results found for "{query}"</p>
              <p className="text-sm text-gray-500 mt-2">Try different keywords or check your filters</p>
            </div>
          )}
        </div>
      )}

      {!query && recentSearches.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => {
                  setQuery(search);
                  performSearch(search);
                }}
              >
                {search}
                <ArrowRight size={14} />
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

ContentSearch.propTypes = {
  onResultClick: PropTypes.func,
  className: PropTypes.string
};

export default ContentSearch;