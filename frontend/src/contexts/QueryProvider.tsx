import React from 'react';

interface QueryProviderProps {
  children: React.ReactNode;
}

// Simplified provider - remove React Query dependency
const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export default QueryProvider;