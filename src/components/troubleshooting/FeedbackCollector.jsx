import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown, Send, X } from 'lucide-react';

/**
 * Component for collecting user feedback on troubleshooting content
 */
const FeedbackCollector = ({ contentId, contentType, onFeedbackSubmit, className }) => {
  const [feedbackState, setFeedbackState] = useState('initial'); // initial, positive, negative, comment, submitted
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(null);
  
  // Handle helpful/not helpful button click
  const handleRatingClick = (isHelpful) => {
    setRating(isHelpful);
    setFeedbackState(isHelpful ? 'positive' : 'negative');
  };
  
  // Handle comment submission
  const handleSubmitComment = () => {
    if (comment.trim() || rating !== null) {
      onFeedbackSubmit?.({
        contentId,
        contentType,
        rating,
        comment: comment.trim(),
        timestamp: new Date().toISOString()
      });
      setFeedbackState('submitted');
    }
  };
  
  // Handle cancel comment
  const handleCancelComment = () => {
    if (rating === true) {
      setFeedbackState('positive');
    } else if (rating === false) {
      setFeedbackState('negative');
    } else {
      setFeedbackState('initial');
    }
    setComment('');
  };
  
  // Reset feedback form
  const resetFeedback = () => {
    setFeedbackState('initial');
    setRating(null);
    setComment('');
  };
  
  // Render based on current state
  switch (feedbackState) {
    case 'initial':
      return (
        <div className={`border-t border-gray-200 pt-4 mt-4 ${className || ''}`}>
          <p className="text-sm text-gray-600 mb-2">Was this information helpful?</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleRatingClick(true)}
            >
              <ThumbsUp size={14} />
              Yes, it helped
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleRatingClick(false)}
            >
              <ThumbsDown size={14} />
              No, I need more help
            </Button>
          </div>
        </div>
      );
      
    case 'positive':
      return (
        <div className={`border-t border-gray-200 pt-4 mt-4 ${className || ''}`}>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium mb-2">Thanks for your feedback!</p>
            <p className="text-green-700 text-sm mb-3">We're glad this information was helpful.</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFeedbackState('comment')}
              >
                Add a comment
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFeedback}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      );
      
    case 'negative':
      return (
        <div className={`border-t border-gray-200 pt-4 mt-4 ${className || ''}`}>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 font-medium mb-2">We're sorry this wasn't helpful</p>
            <p className="text-yellow-700 text-sm mb-3">Please let us know what was missing or how we can improve.</p>
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => setFeedbackState('comment')}
              >
                Tell us what's missing
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFeedback}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      );
      
    case 'comment':
      return (
        <div className={`border-t border-gray-200 pt-4 mt-4 ${className || ''}`}>
          <p className="text-sm text-gray-600 mb-2">
            {rating === true 
              ? 'What did you find most helpful?' 
              : 'What information was missing or unclear?'}
          </p>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Your feedback helps us improve our content..."
            className="mb-3"
            rows={3}
          />
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleSubmitComment}
            >
              <Send size={14} />
              Submit Feedback
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleCancelComment}
            >
              <X size={14} />
              Cancel
            </Button>
          </div>
        </div>
      );
      
    case 'submitted':
      return (
        <div className={`border-t border-gray-200 pt-4 mt-4 ${className || ''}`}>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">Thank you for your feedback!</p>
            <p className="text-blue-700 text-sm">Your input helps us improve our troubleshooting guides.</p>
          </div>
        </div>
      );
      
    default:
      return null;
  }
};

FeedbackCollector.propTypes = {
  contentId: PropTypes.string.isRequired,
  contentType: PropTypes.string.isRequired,
  onFeedbackSubmit: PropTypes.func,
  className: PropTypes.string
};

export default FeedbackCollector;