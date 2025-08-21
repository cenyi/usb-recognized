import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, Clock, RefreshCw } from 'lucide-react';

/**
 * Component for displaying content version information and freshness indicators
 */
const ContentVersionInfo = ({ 
  lastUpdated, 
  version, 
  author, 
  isVerified = false,
  className 
}) => {
  // Calculate content freshness
  const getFreshness = (dateString) => {
    if (!dateString) return 'unknown';
    
    const updateDate = new Date(dateString);
    const now = new Date();
    const diffMonths = (now.getFullYear() - updateDate.getFullYear()) * 12 + 
                       now.getMonth() - updateDate.getMonth();
    
    if (diffMonths < 1) return 'fresh';
    if (diffMonths < 6) return 'recent';
    if (diffMonths < 12) return 'aging';
    return 'outdated';
  };
  
  // Get badge color based on freshness
  const getFreshnessColor = (freshness) => {
    switch (freshness) {
      case 'fresh': return 'bg-green-100 text-green-800 border-green-200';
      case 'recent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'aging': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'outdated': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const freshness = getFreshness(lastUpdated);
  
  return (
    <div className={`flex flex-wrap items-center gap-2 text-sm ${className || ''}`}>
      {lastUpdated && (
        <div className="flex items-center gap-1">
          <Clock size={14} className="text-gray-500" />
          <span className="text-gray-600">Updated: {formatDate(lastUpdated)}</span>
        </div>
      )}
      
      {version && (
        <div className="flex items-center gap-1">
          <RefreshCw size={14} className="text-gray-500" />
          <span className="text-gray-600">Version: {version}</span>
        </div>
      )}
      
      {freshness !== 'unknown' && (
        <Badge className={getFreshnessColor(freshness)}>
          {freshness === 'fresh' && 'Recently Updated'}
          {freshness === 'recent' && 'Up to Date'}
          {freshness === 'aging' && 'Update Recommended'}
          {freshness === 'outdated' && 'Content Outdated'}
        </Badge>
      )}
      
      {isVerified && (
        <Badge variant="outline" className="border-green-300 text-green-700">
          <InfoIcon size={12} className="mr-1" />
          Verified Content
        </Badge>
      )}
      
      {author && (
        <span className="text-gray-500 text-xs">
          By: {author}
        </span>
      )}
    </div>
  );
};

ContentVersionInfo.propTypes = {
  lastUpdated: PropTypes.string,
  version: PropTypes.string,
  author: PropTypes.string,
  isVerified: PropTypes.bool,
  className: PropTypes.string
};

export default ContentVersionInfo;