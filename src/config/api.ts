// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'API_CONFIG.BASE_URL';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: `${API_BASE_URL}/api/login`,
    REGISTER: `${API_BASE_URL}/api/register`,
    PROFILE: `${API_BASE_URL}/api/profile`,
    
    // Data endpoints
    TOURS: `${API_BASE_URL}/api/tours`,
    HOTELS: `${API_BASE_URL}/api/hotels`,
    SERVICES: `${API_BASE_URL}/api/services`,
    CRUISES: `${API_BASE_URL}/api/cruises`,
    FOREIGN_TOURS: `${API_BASE_URL}/api/foreign-tours`,
    PROMOTIONS: `${API_BASE_URL}/api/promotions`,
    
    // Cart endpoints
    CART: `${API_BASE_URL}/api/cart`,
    ORDERS: `${API_BASE_URL}/api/orders`,
    
    // Bonus endpoints
    BONUS_POINTS: `${API_BASE_URL}/api/bonus/points`,
    BONUS_ADD: `${API_BASE_URL}/api/bonus/add`,
    
    // Upload endpoints
    UPLOAD: `${API_BASE_URL}/api/upload`,
    HERO_BACKGROUNDS: `${API_BASE_URL}/api/hero-backgrounds`,
  }
};

export default API_CONFIG;
