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
import './ForeignPage.css';


interface ForeignTour {
  id: number;
  name: string;
  description: string;
  price: number;
  country: string;
  duration?: string;
  category?: string;
  image_url?: string;
  highlights?: string[] | string;
  available: boolean;
}

// Популярные страны для путешествий
const POPULAR_COUNTRIES = [
  'Италия',
  'Франция',
  'Испания',
  'Германия',
  'Турция',
  'Греция',
  'Таиланд',
  'Япония',
  'США',
  'ОАЭ'
];

const ForeignPage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('Все');
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [foreignTours, setForeignTours] = useState<ForeignTour[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchForeignTours = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/foreign-tours');
      setForeignTours(response.data.map((tour: any) => ({
        ...tour,
        highlights: tour.highlights ? JSON.parse(tour.highlights) : []
      })));
    } catch (error) {
      console.error('Error fetching foreign tours:', error);
      toast.error('Ошибка загрузки зарубежных туров');
    } finally {
      setLoading(false);
    }
  }, []);

  // Автоматическое обновление данных каждые 30 секунд
  useAutoRefresh(fetchForeignTours, { interval: 30000 });

  // Первоначальная загрузка
  useEffect(() => {
    fetchForeignTours();
  }, [fetchForeignTours]);

  // Получаем все страны из туров и добавляем популярные
  const allCountries = Array.from(new Set([
    ...POPULAR_COUNTRIES,
    ...foreignTours.map(tour => tour.country)
  ]));
  const countries = ['Все', ...allCountries];
  
  const categories = ['Все', ...Array.from(new Set(foreignTours.map(tour => tour.category || '').filter(Boolean)))];

  const filteredTours = foreignTours.filter(tour => {
    const countryMatch = selectedCountry === 'Все' || tour.country === selectedCountry;
    const categoryMatch = selectedCategory === 'Все' || tour.category === selectedCategory;
    return countryMatch && categoryMatch;
  });

  if (loading) {
    return (
      <div className="foreign-page">
        <UniversalHeroSection
          pageName="foreign"
          title="Зарубежные туры"
          description="Загрузка зарубежных туров..."
        />
      </div>
    );
  }

  const handleAddToCart = async (tour: ForeignTour) => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      navigate('/login');
      return;
    }

    try {
      await addToCart(tour.id, 'foreign', tour);
    } catch (error) {
      // Error is handled in CartContext
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <div className="foreign-page">
      <UniversalHeroSection
        pageName="foreign"
        title="Зарубежные туры"
        description="Откройте для себя удивительные страны и культуры мира"
      />

      <div className="foreign-container">
        <aside className="filters-sidebar">
          <h3>Страны</h3>
          
          <div className="filter-group">
            <select 
              className="filter-select"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="Все">Все страны</option>
              {countries.filter(country => country !== 'Все').map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <h3>Категории</h3>
          
          <div className="filter-group">
            <select 
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="Все">Все категории</option>
              {categories.filter(cat => cat !== 'Все').map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </aside>

        <main className="foreign-content">
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
                  onClick={() => navigate(`/foreign-tour/${tour.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {tour.image_url ? (
                    <img 
                      src={getImageUrl(tour.image_url)} 
                      alt={tour.name}
                      onLoad={() => console.log('Image loaded:', getImageUrl(tour.image_url))}
                      onError={(e) => {
                        console.error('Image failed to load:', getImageUrl(tour.image_url));
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const placeholder = target.nextElementSibling as HTMLElement;
                        if (placeholder) {
                          placeholder.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div 
                    className="tour-image-placeholder"
                    style={{ display: tour.image_url ? 'none' : 'flex' }}
                  >
                    {tour.country.charAt(0)}
                  </div>
                  <div className="tour-price">{formatPrice(tour.price)} ₽</div>
                  <div className="tour-country">{tour.country}</div>
                </div>
                <div className="tour-content">
                  <div className="tour-main-content">
                    <h3 
                      onClick={() => navigate(`/foreign-tour/${tour.id}`)}
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {tour.name}
                    </h3>
                    <p className="tour-description">{tour.description}</p>
                    {tour.duration && (
                      <p className="tour-duration">⏱ {tour.duration}</p>
                    )}
                    {tour.category && (
                      <p className="tour-category">🏷️ {tour.category}</p>
                    )}
                  </div>
                  <div className="tour-buttons">
                    <button 
                      className="btn-secondary"
                      onClick={() => navigate(`/foreign-tour/${tour.id}`)}
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

export default ForeignPage;

