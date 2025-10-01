// Error handling utility for frontend
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data.message || 'An error occurred';
    
    switch (status) {
      case 400:
        console.error('Bad Request:', message);
        throw new Error(`Validation Error: ${message}`);
      case 401:
        console.error('Unauthorized:', message);
        // Redirect to login or handle auth error
        throw new Error('Please login to continue');
      case 404:
        console.error('Not Found:', message);
        throw new Error('Resource not found');
      default:
        console.error('API Error:', message);
        throw new Error('An unexpected error occurred');
    }
  } else if (error.request) {
    // Request made but no response received
    console.error('Network Error:', error.request);
    throw new Error('Network error - please check your connection');
  } else {
    // Error in request setup
    console.error('Request Error:', error.message);
    throw new Error('Failed to make request');
  }
};

// Service worker error handler
export const handleServiceWorkerError = (error) => {
  console.error('Service Worker Error:', error);
  if (error.message.includes('disconnected port')) {
    // Handle port disconnection error
    console.warn('Service Worker port disconnected - attempting to reconnect');
    // Attempt to re-register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker re-registered:', registration);
        })
        .catch(err => {
          console.error('Service Worker re-registration failed:', err);
        });
    }
  }
};