import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient,QueryClientProvider } from '@tanstack/react-query';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
      <App />
      </QueryClientProvider>
    </ChakraProvider>
  </StrictMode>,
)
