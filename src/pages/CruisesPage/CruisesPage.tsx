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
import './CruisesPage.css';


interface Cruise {
  id: number;
  name: string;
  description: string;
  price: number;
  duration?: string;
  departure: string;
  destination?: string;
  category?: string;
  image_url?: string;
  available: boolean;
}

const CruisesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [cruises, setCruises] = useState<Cruise[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchCruises = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cruises');
      setCruises(response.data);
    } catch (error) {
      console.error('Error fetching cruises:', error);
      toast.error('Ошибка загрузки круизов');
    } finally {
      setLoading(false);
    }
  }, []);

  // Автоматическое обновление данных каждые 30 секунд
  const { refresh } = useAutoRefresh(fetchCruises, { interval: 30000 });

  // Первоначальная загрузка
  useEffect(() => {
    fetchCruises();
  }, [fetchCruises]);

  if (loading) {
    return (
      <div className="cruises-page">
        <UniversalHeroSection
          pageName="cruises"
          title="Круизы"
          description="Загрузка круизов..."
        />
      </div>
    );
  }



  const handleAddToCart = async (cruise: Cruise) => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      navigate('/login');
      return;
    }

    try {
      await addToCart(cruise.id, 'cruise', cruise);
    } catch (error) {
      // Error is handled in CartContext
    }
  };

  const categories = ['Все', ...Array.from(new Set(cruises.map(cruise => cruise.category || '').filter(Boolean)))];

  const filteredCruises = selectedCategory === 'Все' 
    ? cruises 
    : cruises.filter(cruise => cruise.category === selectedCategory);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <div className="cruises-page">
      <UniversalHeroSection
        pageName="cruises"
        title="Astoria Grande"
        description="Первый круизный лайнер с выходом из порта Сочи"
      />

      <div className="cruises-container">
        <aside className="filters-sidebar">
          <h3>Направления</h3>
          
          <div className="filter-group">
            <select 
              className="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </aside>

        <main className="cruises-content">
          <div className="cruises-grid">
          {filteredCruises.map((cruise, index) => (
            <motion.article
              key={cruise.id}
              className="cruise-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div 
                className="cruise-image"
                onClick={() => navigate(`/cruise/${cruise.id}`)}
                style={{ cursor: 'pointer' }}
              >
                {cruise.image_url ? (
                  <img 
                    src={getImageUrl(cruise.image_url)} 
                    alt={cruise.name} 
                  />
                ) : (
                  <div className="cruise-image-placeholder">
                    🚢
                  </div>
                )}
                <div className="cruise-price">{formatPrice(cruise.price)} ₽</div>
                <div className="cruise-duration">{cruise.duration}</div>
              </div>
              <div className="cruise-content">
                <h3 
                  onClick={() => navigate(`/cruise/${cruise.id}`)}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {cruise.name}
                </h3>
                <p className="cruise-description">{cruise.description}</p>
                <div className="cruise-details">
                  <span className="cruise-departure">🚢 Отправление: {cruise.departure}</span>
                  {cruise.destination && (
                    <span className="cruise-destination">📍 Направление: {cruise.destination}</span>
                  )}
                  {cruise.category && (
                    <span className="cruise-category">🏷️ {cruise.category}</span>
                  )}
                </div>
                <div className="cruise-buttons">
                  <button 
                    className="btn-secondary"
                    onClick={() => navigate(`/cruise/${cruise.id}`)}
                  >
                    Подробнее
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => handleAddToCart(cruise)}
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

export default CruisesPage;


