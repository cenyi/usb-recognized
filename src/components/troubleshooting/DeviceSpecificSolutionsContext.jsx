import { createContext } from 'react';

/**
 * Context for sharing state between device-specific solution components
 * Provides selected platform and other filtering options
 */
const DeviceSpecificSolutionsContext = createContext({
  selectedPlatform: 'all',
  setSelectedPlatform: () => {},
});

export default DeviceSpecificSolutionsContext;