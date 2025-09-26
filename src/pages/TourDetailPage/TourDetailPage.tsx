import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUtils';
import './TourDetailPage.css';

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

const TourDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchTour();
  }, [id]);

  const fetchTour = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/tours/${id}`);
      setTour(response.data);
    } catch (error: any) {
      console.error('Error fetching tour:', error);
      if (error.response?.status === 404) {
        setError('Тур не найден');
      } else {
        setError('Ошибка загрузки тура');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!tour) return;
    
    if (!user) {
      toast.error('Необходимо войти в систему');
      navigate('/login');
      return;
    }

    try {
      await addToCart(tour.id, 'tour', tour);
      toast.success('Тур добавлен в корзину');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Ошибка добавления в корзину');
    }
  };

  const handleBackClick = () => {
    navigate('/tours');
  };

  if (loading) {
    return (
      <div className="tour-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка тура...</p>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="tour-detail-page">
        <div className="error-container">
          <h2>Ошибка</h2>
          <p>{error || 'Тур не найден'}</p>
          <button onClick={handleBackClick} className="btn-primary">
            Вернуться к турам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tour-detail-page">
      <div className="tour-hero">
        <div className="tour-hero-content">
          <motion.button
            onClick={handleBackClick}
            className="back-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Назад к турам
          </motion.button>
          
          <motion.div
            className="tour-hero-info"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="tour-category">{tour.category || 'Тур'}</div>
            <h1 className="tour-title">{tour.name}</h1>
            <p className="tour-description">{tour.description}</p>
            
            <div className="tour-price-section">
              <div className="tour-price">
                {new Intl.NumberFormat('ru-RU').format(tour.price)} ₽
              </div>
              <div className="tour-status">
                {tour.available ? (
                  <span className="status-available">✓ Доступен</span>
                ) : (
                  <span className="status-unavailable">✗ Недоступен</span>
                )}
              </div>
            </div>

            {tour.available && (
            <motion.button
              className="btn-primary book-tour-btn"
              onClick={handleAddToCart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Забронировать
            </motion.button>
            )}
          </motion.div>
        </div>

        {tour.image_url && (
          <div className="tour-hero-image">
            <motion.img
              src={getImageUrl(tour.image_url)}
              alt={tour.name}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            />
          </div>
        )}
      </div>

      <div className="tour-details">
        <div className="container">
          <div className="tour-details-grid">
            <div className="tour-info-card">
              <h3>Информация о туре</h3>
              <div className="info-item">
                <strong>Название:</strong>
                <span>{tour.name}</span>
              </div>
              <div className="info-item">
                <strong>Длительность:</strong>
                <span>{tour.duration || 'Не указана'}</span>
              </div>
              <div className="info-item">
                <strong>Направление:</strong>
                <span>{tour.destination || tour.city || 'Не указано'}</span>
              </div>
              <div className="info-item">
                <strong>Город:</strong>
                <span>{tour.city || 'Не указан'}</span>
              </div>
              <div className="info-item">
                <strong>Категория:</strong>
                <span>{tour.category || 'Общие туры'}</span>
              </div>
              <div className="info-item">
                <strong>Тип тура:</strong>
                <span>{tour.tour_type || 'Не указан'}</span>
              </div>
              <div className="info-item">
                <strong>Цена:</strong>
                <span className="price-highlight">
                  {new Intl.NumberFormat('ru-RU').format(tour.price)} ₽
                </span>
              </div>
              <div className="info-item">
                <strong>Статус:</strong>
                <span className={tour.available ? 'status-available' : 'status-unavailable'}>
                  {tour.available ? 'Доступен для бронирования' : 'Временно недоступен'}
                </span>
              </div>
            </div>

            <div className="tour-description-card">
              <h3>Подробное описание</h3>
              <p>{tour.description}</p>
              
              <div className="contact-info">
                <h4>Как забронировать?</h4>
                <p>Для бронирования этого тура вы можете:</p>
                <ul>
                  <li>Добавить тур в корзину и оформить заказ</li>
                  <li>Связаться с нами по телефону или через форму обратной связи</li>
                  <li>Посетить наш офис для личной консультации</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tour-cta">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3>Готовы забронировать этот тур?</h3>
            <p>Свяжитесь с нами для получения дополнительной информации и оформления бронирования</p>
            <div className="cta-buttons">
              {tour.available && (
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

export default TourDetailPage;
