import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUtils';
import './ServicePage.css';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  available: boolean;
}

const ServicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/services/${id}`);
      setService(response.data);
    } catch (error: any) {
      console.error('Error fetching service:', error);
      if (error.response?.status === 404) {
        setError('Услуга не найдена');
      } else {
        setError('Ошибка загрузки услуги');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!service) return;
    
    if (!user) {
      toast.error('Необходимо войти в систему');
      navigate('/login');
      return;
    }

    try {
      await addToCart(service.id, 'service', service);
      toast.success('Услуга добавлена в корзину');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Ошибка добавления в корзину');
    }
  };

  const handleBackClick = () => {
    navigate('/services');
  };

  if (loading) {
    return (
      <div className="service-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка услуги...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="service-page">
        <div className="error-container">
          <h2>Ошибка</h2>
          <p>{error || 'Услуга не найдена'}</p>
          <button onClick={handleBackClick} className="btn-primary">
            Вернуться к услугам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="service-page">
      <div className="service-hero">
        <div className="service-hero-content">
          <motion.button
            onClick={handleBackClick}
            className="back-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Назад к услугам
          </motion.button>
          
          <motion.div
            className="service-hero-info"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="service-category">{service.category}</div>
            <h1 className="service-title">{service.name}</h1>
            <p className="service-description">{service.description}</p>
            
            <div className="service-price-section">
              <div className="service-price">
                {new Intl.NumberFormat('ru-RU').format(service.price)} ₽
              </div>
              <div className="service-status">
                {service.available ? (
                  <span className="status-available">✓ Доступна</span>
                ) : (
                  <span className="status-unavailable">✗ Недоступна</span>
                )}
              </div>
            </div>

            {service.available && (
              <motion.button
                className="btn-primary book-service-btn"
                onClick={handleAddToCart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Забронировать
              </motion.button>
            )}
          </motion.div>
        </div>

        {service.image_url && (
          <div className="service-hero-image">
            <motion.img
              src={getImageUrl(service.image_url)}
              alt={service.name}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            />
          </div>
        )}
      </div>

      <div className="service-details">
        <div className="container">
          <div className="service-details-grid">
            <div className="service-info-card">
              <h3>Информация об услуге</h3>
              <div className="info-item">
                <strong>Название:</strong>
                <span>{service.name}</span>
              </div>
              <div className="info-item">
                <strong>Категория:</strong>
                <span>{service.category}</span>
              </div>
              <div className="info-item">
                <strong>Цена:</strong>
                <span className="price-highlight">
                  {new Intl.NumberFormat('ru-RU').format(service.price)} ₽
                </span>
              </div>
              <div className="info-item">
                <strong>Статус:</strong>
                <span className={service.available ? 'status-available' : 'status-unavailable'}>
                  {service.available ? 'Доступна для заказа' : 'Временно недоступна'}
                </span>
              </div>
            </div>

            <div className="service-description-card">
              <h3>Подробное описание</h3>
              <p>{service.description}</p>
              
              <div className="contact-info">
                <h4>Как заказать?</h4>
                <p>Для заказа этой услуги вы можете:</p>
                <ul>
                  <li>Добавить услугу в корзину и оформить заказ</li>
                  <li>Связаться с нами по телефону или через форму обратной связи</li>
                  <li>Посетить наш офис для личной консультации</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="service-cta">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3>Готовы заказать эту услугу?</h3>
            <p>Свяжитесь с нами для получения дополнительной информации и оформления заказа</p>
            <div className="cta-buttons">
              {service.available && (
                <motion.button
                  className="btn-primary"
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Забронировать
                </motion.button>
              )}
              <motion.button
                className="btn-secondary"
                onClick={() => navigate('/contact')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Связаться с нами
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
