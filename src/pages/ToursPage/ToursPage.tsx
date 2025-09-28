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
import './ToursPage.css';


interface Tour {
  id: number;
  name: string;
  description: string;
  price: number;
  duration?: string;
  destination?: string;
  city?: string;
  category?: string;
  tour_type?: string;
  image_url?: string;
  available: boolean;
}

const ToursPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [selectedCity, setSelectedCity] = useState<string>('Все');
  const [selectedType, setSelectedType] = useState<string>('Все');
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const toursResponse = await axios.get('http://localhost:5000/api/tours');
      setTours(toursResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }, []);

  // Автоматическое обновление данных каждые 30 секунд
  const { refresh } = useAutoRefresh(fetchData, { interval: 30000 });

  // Первоначальная загрузка
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Получаем уникальные категории, города и типы из данных
  const tourCategories = ['Все', ...Array.from(new Set(tours.map(tour => tour.category || '').filter(Boolean)))];
  const tourCities = ['Все', ...Array.from(new Set(tours.map(tour => tour.city || tour.destination || '').filter(Boolean)))];
  const tourTypes = ['Все', ...Array.from(new Set(tours.map(tour => tour.tour_type || '').filter(Boolean)))];

  const filteredTours = tours.filter(tour => {
    const categoryMatch = selectedCategory === 'Все' || tour.category === selectedCategory;
    const cityMatch = selectedCity === 'Все' || tour.city === selectedCity || tour.destination === selectedCity;
    const typeMatch = selectedType === 'Все' || tour.tour_type === selectedType;
    return categoryMatch && cityMatch && typeMatch;
  });

  if (loading) {
    return (
      <div className="tours-page">
        <div className="tours-hero">
          <h1>Загрузка туров...</h1>
        </div>
      </div>
    );
  }

  const handleAddToCart = async (tour: Tour) => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      navigate('/login');
      return;
    }

    try {
      await addToCart(tour.id, 'tour', tour);
    } catch (error) {
      // Error is handled in CartContext
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <div className="tours-page">
      <UniversalHeroSection
        pageName="tours"
        title="Туры по России"
        description="Откройте для себя красоты России - от Сочи до Санкт-Петербурга"
      />

      <div className="tours-container">
        <aside className="filters-sidebar">
          <h3>Фильтры</h3>
          
          <div className="filter-group">
            <h4>Города</h4>
            <select 
              className="filter-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="Все">Все города</option>
              {tourCities.filter(city => city !== 'Все').map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <h4>Типы туров</h4>
            <select 
              className="filter-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="Все">Все типы</option>
              {tourTypes.filter(type => type !== 'Все').map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <h4>Категории</h4>
            <select 
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="Все">Все категории</option>
              {tourCategories.filter(cat => cat !== 'Все').map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </aside>

        <main className="tours-content">
          <div className="tours-grid">
            {filteredTours.map((tour, index) => (
              <motion.article
                key={tour.id}
                className="tour-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div 
                  className="tour-image"
                  onClick={() => navigate(`/tour/${tour.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {tour.image_url ? (
                    <img 
                      src={getImageUrl(tour.image_url)} 
                      alt={tour.name} 
                    />
                  ) : (
                    <div className="tour-image-placeholder">
                      {tour.name.charAt(0)}
                    </div>
                  )}
                  <div className="tour-price">{formatPrice(tour.price)} ₽</div>
                </div>
                <div className="tour-content">
                  <h3 
                    onClick={() => navigate(`/tour/${tour.id}`)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {tour.name}
                  </h3>
                  <p className="tour-description">{tour.description}</p>
                  {tour.duration && (
                    <p className="tour-duration">⏱ {tour.duration}</p>
                  )}
                  {tour.city && (
                    <p className="tour-destination">🏙️ {tour.city}</p>
                  )}
                  {tour.destination && !tour.city && (
                    <p className="tour-destination">📍 {tour.destination}</p>
                  )}
                  {tour.category && (
                    <p className="tour-category">🏷️ {tour.category}</p>
                  )}
                  {tour.tour_type && (
                    <p className="tour-type">🎯 {tour.tour_type}</p>
                  )}
                  <div className="tour-buttons">
                    <button 
                      className="btn-secondary"
                      onClick={() => navigate(`/tour/${tour.id}`)}
                    >
                      Подробнее
                    </button>
        <button 
          className="btn-primary"
          onClick={() => handleAddToCart(tour)}
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

export default ToursPage;
