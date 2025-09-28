import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUtils';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import UniversalHeroSection from '../../components/UniversalHeroSection/UniversalHeroSection';
import './HotelsPage.css';
import API_CONFIG from '..\..\config/api';

interface Hotel {
  id: number;
  name: string;
  description: string;
  price: number;
  location: string;
  stars: number;
  category?: string;
  city?: string;
  image_url?: string;
  available: boolean;
}

const HotelsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [selectedCity, setSelectedCity] = useState<string>('Все');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const [hotelsResponse, citiesResponse] = await Promise.all([
        axios.get('API_CONFIG.ENDPOINTS.hotels'),
        axios.get('API_CONFIG.ENDPOINTS.hotels/cities')
      ]);
      setHotels(hotelsResponse.data);
      setCities(citiesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }, []);

  // Автоматическое обновление данных каждые 30 секунд
  useAutoRefresh(fetchData, { interval: 30000 });

  // Первоначальная загрузка
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Получаем уникальные категории из данных
  const hotelCategories = ['Все', ...Array.from(new Set(hotels.map(hotel => hotel.category || '').filter(Boolean)))];

  const filteredHotels = hotels.filter(hotel => {
    const categoryMatch = selectedCategory === 'Все' || hotel.category === selectedCategory;
    const cityMatch = selectedCity === 'Все' || hotel.city === selectedCity;
    return categoryMatch && cityMatch;
  });

  if (loading) {
    return (
      <div className="hotels-page">
        <UniversalHeroSection
          pageName="hotels"
          title="Отели и гостиницы"
          description="Загрузка отелей..."
        />
      </div>
    );
  }

  const handleAddToCart = async (hotel: Hotel) => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      navigate('/login');
      return;
    }

    try {
      await addToCart(hotel.id, 'hotel', hotel);
    } catch (error) {
      // Error is handled in CartContext
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const renderStars = (stars: number) => {
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  };

  return (
    <div className="hotels-page">
      <UniversalHeroSection
        pageName="hotels"
        title="Отели и гостиницы"
        description="Найдите идеальный отель для вашего отдыха в Сочи и окрестностях"
      />

      <div className="hotels-container">
        <aside className="filters-sidebar">
          <h3>Категории отелей</h3>
          
          <div className="filter-group">
            <select 
              className="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="Все">Все категории</option>
              {hotelCategories.filter(cat => cat !== 'Все').map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <h3>Города</h3>
          
          <div className="filter-group">
            <select 
              className="city-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="Все">Все города</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </aside>

        <main className="hotels-content">
          <div className="hotels-grid">
            {filteredHotels.map((hotel, index) => (
              <motion.article
                key={hotel.id}
                className="hotel-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div 
                  className="hotel-image"
                  onClick={() => navigate(`/hotel/${hotel.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {hotel.image_url ? (
                    <img 
                      src={getImageUrl(hotel.image_url)} 
                      alt={hotel.name} 
                    />
                  ) : (
                    <div className="hotel-image-placeholder">
                      {hotel.name.charAt(0)}
                    </div>
                  )}
                  <div className="hotel-price">{formatPrice(hotel.price)} ₽</div>
                </div>
                <div className="hotel-content">
                  <h3 
                    onClick={() => navigate(`/hotel/${hotel.id}`)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {hotel.name}
                  </h3>
                  <p className="hotel-description">{hotel.description}</p>
                  <p className="hotel-location">📍 {hotel.location}</p>
                  <p className="hotel-stars">⭐ {renderStars(hotel.stars)}</p>
                  {hotel.category && (
                    <p className="hotel-category">🏷️ {hotel.category}</p>
                  )}
                  <div className="hotel-buttons">
                    <button 
                      className="btn-secondary"
                      onClick={() => navigate(`/hotel/${hotel.id}`)}
                    >
                      Подробнее
                    </button>
        <button 
          className="btn-primary"
          onClick={() => handleAddToCart(hotel)}
        >
          Забронировать
        </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HotelsPage;

