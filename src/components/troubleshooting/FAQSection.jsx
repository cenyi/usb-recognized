import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, ThumbsUp, ThumbsDown, Filter } from 'lucide-react';
import { faqData } from '@/data/troubleshootingContent';
import { getPopularFAQ } from '@/utils/troubleshootingUtils';

/**
 * Comprehensive FAQ section with search and filtering
 */
const FAQSection = ({ maxInitialItems = 10 }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState([]);
  const [helpfulRatings, setHelpfulRatings] = useState({});
  const [showAll, setShowAll] = useState(false);

  // Get all available categories
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(faqData.map(item => item.category))];
    return cats.map(cat => ({
      id: cat,
      label: cat === 'all' ? 'All Categories' : 
             cat === 'general' ? 'General Questions' :
             cat === 'windows' ? 'Windows Issues' :
             cat === 'mac' ? 'macOS Issues' :
             cat === 'linux' ? 'Linux Issues' :
             cat.charAt(0).toUpperCase() + cat.slice(1)
    }));
  }, []);

  // Filter and sort FAQs based on search query and category
  const filteredFAQs = useMemo(() => {
    let filtered = faqData;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.question.toLowerCase().includes(query) || 
        item.answer.toLowerCase().includes(query) ||
        item.keywords.some(keyword => keyword.toLowerCase().includes(query))
      );
    }
    
    // Sort by search volume (popularity) if no search query
    if (!searchQuery.trim()) {
      filtered = [...filtered].sort((a, b) => (b.searchVolume || 0) - (a.searchVolume || 0));
    }
    
    return filtered;
  }, [faqData, searchQuery, selectedCategory]);

  // Get FAQs to display based on showAll flag
  const displayedFAQs = useMemo(() => {
    if (showAll || searchQuery.trim() || selectedCategory !== 'all') {
      return filteredFAQs;
    }
    return filteredFAQs.slice(0, maxInitialItems);
  }, [filteredFAQs, showAll, searchQuery, selectedCategory, maxInitialItems]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowAll(true); // Show all results when searching
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setShowAll(category !== 'all'); // Show all results when filtering by category
  };

  // Handle FAQ item expansion
  const handleItemToggle = (itemId) => {
    setExpandedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Handle helpful/not helpful rating
  const handleRating = (itemId, isHelpful) => {
    setHelpfulRatings(prev => ({
      ...prev,
      [itemId]: isHelpful
    }));
  };

  return (
    <section id="faq" className="mb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
          <p className="text-gray-600">
            Find answers to common USB troubleshooting questions
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search FAQ questions..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(category.id)}
            className="flex items-center gap-1"
          >
            {category.id === 'all' && <Filter size={14} />}
            {category.label}
          </Button>
        ))}
      </div>

      {displayedFAQs.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No FAQ items match your search criteria.</p>
          <Button 
            variant="link" 
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <Accordion type="multiple" value={expandedItems} className="w-full">
          {displayedFAQs.map((faq) => (
            <AccordionItem 
              key={faq.id} 
              value={faq.id}
              className="border border-gray-200 rounded-lg mb-3 overflow-hidden"
            >
              <AccordionTrigger 
                onClick={() => handleItemToggle(faq.id)}
                className="px-4 py-3 hover:bg-gray-50"
              >
                <div className="text-left">
                  <div className="font-medium text-lg">{faq.question}</div>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {categories.find(c => c.id === faq.category)?.label || faq.category}
                    </Badge>
                    {faq.searchVolume > 10000 && (
                      <Badge variant="secondary" className="text-xs">Popular</Badge>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <div className="prose max-w-none text-gray-700">
                  <p>{faq.answer}</p>
                </div>
                
                {faq.relatedSolutions && faq.relatedSolutions.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Related Solutions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {faq.relatedSolutions.map(solution => (
                        <Badge key={solution} variant="secondary">
                          {solution}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Last updated: {faq.lastUpdated || 'Recently'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Was this helpful?</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRating(faq.id, true)}
                      className={helpfulRatings[faq.id] === true ? "bg-green-100 text-green-700" : ""}
                    >
                      <ThumbsUp size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRating(faq.id, false)}
                      className={helpfulRatings[faq.id] === false ? "bg-red-100 text-red-700" : ""}
                    >
                      <ThumbsDown size={16} />
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {!showAll && filteredFAQs.length > maxInitialItems && (
        <div className="text-center mt-6">
          <Button 
            variant="outline" 
            onClick={() => setShowAll(true)}
          >
            Show All ({filteredFAQs.length}) Questions
          </Button>
        </div>
      )}
    </section>
  );
};

FAQSection.propTypes = {
  maxInitialItems: PropTypes.number
};

export default FAQSection;