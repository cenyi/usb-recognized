import React from 'react';

const ImagePlaceholder = ({ 
  width = "100%", 
  height = "200px", 
  title, 
  description, 
  icon: Icon,
  className = "",
  bgColor = "bg-gradient-to-br from-blue-100 to-purple-100"
}) => {
  return (
    <div 
      className={`${bgColor} rounded-lg flex flex-col items-center justify-center p-6 border border-gray-200 ${className}`}
      style={{ width, height }}
    >
      {Icon && <Icon className="text-blue-600 mb-3" size={48} />}
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-gray-600 text-center max-w-xs">
          {description}
        </p>
      )}
      <div className="mt-3 text-xs text-gray-400 italic">
        [Image: {title || 'Illustration'}]
      </div>
    </div>
  );
};

export default ImagePlaceholder;