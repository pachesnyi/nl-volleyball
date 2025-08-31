"use client";

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a singleton QueryClient instance
let queryClient: QueryClient | undefined = undefined;

const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Global defaults for all queries
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000,   // 10 minutes (formerly cacheTime)
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors, but retry on network/5xx errors
          if (error instanceof Error) {
            const message = error.message.toLowerCase();
            if (message.includes('permission') || message.includes('unauthorized')) {
              return false;
            }
          }
          return failureCount < 2;
        },
        refetchOnWindowFocus: false, // Disable refetch on focus by default
        refetchOnReconnect: true,    // Refetch when connection is restored
      },
      mutations: {
        retry: false, // Don't retry mutations by default
        onError: (error) => {
          console.error('❌ Mutation error:', error);
        },
      },
    },
  });
};

const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!queryClient) {
      queryClient = createQueryClient();
    }
    return queryClient;
  }
};

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const client = getQueryClient();

  return (
    <QueryClientProvider client={client}>
      {children}
      {/* Show DevTools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          position="bottom-left"
          buttonPosition="bottom-left"
        />
      )}
    </QueryClientProvider>
  );
}