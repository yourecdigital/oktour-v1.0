import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUtils';
import './HotelDetailPage.css';

interface Hotel {
  id: number;
  name: string;
  description: string;
  price: number;
  location: string;
  category?: string;
  image_url?: string;
  available: boolean;
}

const HotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchHotel();
  }, [id]);

  const fetchHotel = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/hotels/${id}`);
      setHotel(response.data);
    } catch (error: any) {
      console.error('Error fetching hotel:', error);
      if (error.response?.status === 404) {
        setError('Отель не найден');
      } else {
        setError('Ошибка загрузки отеля');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!hotel) return;
    
    if (!user) {
      toast.error('Необходимо войти в систему');
      navigate('/login');
      return;
    }

    try {
      await addToCart(hotel.id, 'hotel', hotel);
      toast.success('Отель добавлен в корзину');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Ошибка добавления в корзину');
    }
  };

  const handleBackClick = () => {
    navigate('/hotels');
  };

  if (loading) {
    return (
      <div className="hotel-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка отеля...</p>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="hotel-detail-page">
        <div className="error-container">
          <h2>Ошибка</h2>
          <p>{error || 'Отель не найден'}</p>
          <button onClick={handleBackClick} className="btn-primary">
            Вернуться к отелям
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hotel-detail-page">
      <div className="hotel-hero">
        <div className="hotel-hero-content">
          <motion.button
            onClick={handleBackClick}
            className="back-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Назад к отелям
          </motion.button>
          
          <motion.div
            className="hotel-hero-info"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="hotel-category">{hotel.category || 'Отель'}</div>
            <h1 className="hotel-title">{hotel.name}</h1>
            <p className="hotel-description">{hotel.description}</p>
            
            <div className="hotel-price-section">
              <div className="hotel-price">
                {new Intl.NumberFormat('ru-RU').format(hotel.price)} ₽
              </div>
              <div className="hotel-status">
                {hotel.available ? (
                  <span className="status-available">✓ Доступен</span>
                ) : (
                  <span className="status-unavailable">✗ Недоступен</span>
                )}
              </div>
            </div>

            {hotel.available && (
            <motion.button
              className="btn-primary book-hotel-btn"
              onClick={handleAddToCart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Забронировать
            </motion.button>
            )}
          </motion.div>
        </div>

        {hotel.image_url && (
          <div className="hotel-hero-image">
            <motion.img
              src={getImageUrl(hotel.image_url)}
              alt={hotel.name}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            />
          </div>
        )}
      </div>

      <div className="hotel-details">
        <div className="container">
          <div className="hotel-details-grid">
            <div className="hotel-info-card">
              <h3>Информация об отеле</h3>
              <div className="info-item">
                <strong>Название:</strong>
                <span>{hotel.name}</span>
              </div>
              <div className="info-item">
                <strong>Местоположение:</strong>
                <span>{hotel.location}</span>
              </div>
              <div className="info-item">
                <strong>Категория:</strong>
                <span>{hotel.category || 'Стандарт'}</span>
              </div>
              <div className="info-item">
                <strong>Цена за ночь:</strong>
                <span className="price-highlight">
                  {new Intl.NumberFormat('ru-RU').format(hotel.price)} ₽
                </span>
              </div>
              <div className="info-item">
                <strong>Статус:</strong>
                <span className={hotel.available ? 'status-available' : 'status-unavailable'}>
                  {hotel.available ? 'Доступен для бронирования' : 'Временно недоступен'}
                </span>
              </div>
            </div>

            <div className="hotel-description-card">
              <h3>Подробное описание</h3>
              <p>{hotel.description}</p>
              
              <div className="contact-info">
                <h4>Как забронировать?</h4>
                <p>Для бронирования этого отеля вы можете:</p>
                <ul>
                  <li>Добавить отель в корзину и оформить заказ</li>
                  <li>Связаться с нами по телефону или через форму обратной связи</li>
                  <li>Посетить наш офис для личной консультации</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hotel-cta">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3>Готовы забронировать этот отель?</h3>
            <p>Свяжитесь с нами для получения дополнительной информации и оформления бронирования</p>
            <div className="cta-buttons">
              {hotel.available && (
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

export default HotelDetailPage;
