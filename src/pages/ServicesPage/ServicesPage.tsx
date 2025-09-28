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
import './ServicesPage.css';


interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  available: boolean;
}

const ServicesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchServices = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Ошибка загрузки услуг');
    } finally {
      setLoading(false);
    }
  }, []);

  // Автоматическое обновление данных каждые 30 секунд
  useAutoRefresh(fetchServices, { interval: 30000 });

  // Первоначальная загрузка
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const categories = ['Все', ...Array.from(new Set(services.map(service => service.category || '').filter(Boolean)))];

  const filteredServices = selectedCategory === 'Все' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  if (loading) {
    return (
      <div className="services-page">
        <UniversalHeroSection
          pageName="services"
          title="Наши услуги"
          description="Загрузка услуг..."
        />
      </div>
    );
  }

  const handleAddToCart = async (service: Service) => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      navigate('/login');
      return;
    }

    try {
      await addToCart(service.id, 'tour', service);
    } catch (error) {
      // Error is handled in CartContext
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <div className="services-page">
      <UniversalHeroSection
        pageName="services"
        title="Наши услуги"
        description="Выберите дополнительные услуги для комфортного отдыха"
      />

      <div className="services-container">
        <aside className="filters-sidebar">
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

        <main className="services-content">
          <div className="services-grid">
            {filteredServices.map((service, index) => (
              <motion.article
                key={service.id}
                className="service-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div 
                  className="service-image"
                  onClick={() => navigate(`/service/${service.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                                  {service.image_url ? (
                  <img 
                    src={getImageUrl(service.image_url)} 
                    alt={service.name} 
                  />
                ) : (
                    <div className="service-icon">
                      {service.category === 'Транспортные услуги' ? '🚗' : 
                       service.category === 'Экскурсионные услуги' ? '🎯' : 
                       service.category === 'Ресторанные услуги' ? '🍽️' : '🛠️'}
                    </div>
                  )}
                </div>
                <div className="service-content">
                  <h3 
                    onClick={() => navigate(`/service/${service.id}`)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {service.name}
                  </h3>
                  <p className="service-description">{service.description}</p>
                  <div className="service-category">📋 {service.category}</div>
                  <div className="service-price">{formatPrice(service.price)} ₽</div>
                  <div className="service-buttons">
                    <button 
                      className="btn-secondary"
                      onClick={() => navigate(`/service/${service.id}`)}
                    >
                      Подробнее
                    </button>
        <button 
          className="btn-primary"
          onClick={() => handleAddToCart(service)}
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

export default ServicesPage;

