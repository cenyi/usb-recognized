import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { combineStructuredData, getOrganizationSchema, getWebApplicationSchema } from '../utils/structuredData';

const NotFound = () => {
  const navigate = useNavigate();

  // Structured data for the 404 page
  const structuredData = combineStructuredData(
    getOrganizationSchema(),
    getWebApplicationSchema()
  );

  return (
    <>
      <SEO
        title="404 Page Not Found - USB Device Recognition Tool"
        description="The USB device recognition page you're looking for doesn't exist or has been moved. Return to USBRecognized.com for free USB device troubleshooting and recognition tools."
        canonical="https://usbrecognized.com/404"
        noindex={true}
        structuredData={structuredData}
        alternateLanguages={[]}
      />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-3xl">
        <div className="inline-block p-4 rounded-full bg-red-100 mb-6">
          <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8 text-lg">
          We're sorry, the page you're looking for doesn't exist or has been moved. Please check the URL and try again, or return to the homepage to continue browsing.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          Back to Home
        </button>
      </div>
    </div>
    </>
  );
};

export default NotFound;