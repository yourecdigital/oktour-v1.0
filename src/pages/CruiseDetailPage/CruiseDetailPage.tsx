import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUtils';
import './CruiseDetailPage.css';

interface Cruise {
  id: number;
  name: string;
  description: string;
  price: number;
  departure: string;
  duration?: string;
  destination?: string;
  category?: string;
  image_url?: string;
  available: boolean;
}

const CruiseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cruise, setCruise] = useState<Cruise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchCruise();
  }, [id]);

  const fetchCruise = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/cruises/${id}`);
      setCruise(response.data);
    } catch (error: any) {
      console.error('Error fetching cruise:', error);
      if (error.response?.status === 404) {
        setError('Круиз не найден');
      } else {
        setError('Ошибка загрузки круиза');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!cruise) return;
    
    if (!user) {
      toast.error('Необходимо войти в систему');
      navigate('/login');
      return;
    }

    try {
      await addToCart(cruise.id, 'cruise', cruise);
      toast.success('Круиз добавлен в корзину');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Ошибка добавления в корзину');
    }
  };

  const handleBackClick = () => {
    navigate('/cruises');
  };

  if (loading) {
    return (
      <div className="cruise-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка круиза...</p>
        </div>
      </div>
    );
  }

  if (error || !cruise) {
    return (
      <div className="cruise-detail-page">
        <div className="error-container">
          <h2>Ошибка</h2>
          <p>{error || 'Круиз не найден'}</p>
          <button onClick={handleBackClick} className="btn-primary">
            Вернуться к круизам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cruise-detail-page">
      <div className="cruise-hero">
        <div className="cruise-hero-content">
          <motion.button
            onClick={handleBackClick}
            className="back-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Назад к круизам
          </motion.button>
          
          <motion.div
            className="cruise-hero-info"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="cruise-category">{cruise.category || 'Круиз'}</div>
            <h1 className="cruise-title">{cruise.name}</h1>
            <p className="cruise-description">{cruise.description}</p>
            
            <div className="cruise-price-section">
              <div className="cruise-price">
                {new Intl.NumberFormat('ru-RU').format(cruise.price)} ₽
              </div>
              <div className="cruise-status">
                {cruise.available ? (
                  <span className="status-available">✓ Доступен</span>
                ) : (
                  <span className="status-unavailable">✗ Недоступен</span>
                )}
              </div>
            </div>

            {cruise.available && (
            <motion.button
              className="btn-primary book-cruise-btn"
              onClick={handleAddToCart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Забронировать
            </motion.button>
            )}
          </motion.div>
        </div>

        {cruise.image_url && (
          <div className="cruise-hero-image">
            <motion.img
              src={getImageUrl(cruise.image_url)}
              alt={cruise.name}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            />
          </div>
        )}
      </div>

      <div className="cruise-details">
        <div className="container">
          <div className="cruise-details-grid">
            <div className="cruise-info-card">
              <h3>Информация о круизе</h3>
              <div className="info-item">
                <strong>Название:</strong>
                <span>{cruise.name}</span>
              </div>
              <div className="info-item">
                <strong>Отправление:</strong>
                <span>{cruise.departure}</span>
              </div>
              <div className="info-item">
                <strong>Длительность:</strong>
                <span>{cruise.duration || 'Не указана'}</span>
              </div>
              <div className="info-item">
                <strong>Направление:</strong>
                <span>{cruise.destination || 'Не указано'}</span>
              </div>
              <div className="info-item">
                <strong>Категория:</strong>
                <span>{cruise.category || 'Общие круизы'}</span>
              </div>
              <div className="info-item">
                <strong>Цена:</strong>
                <span className="price-highlight">
                  {new Intl.NumberFormat('ru-RU').format(cruise.price)} ₽
                </span>
              </div>
              <div className="info-item">
                <strong>Статус:</strong>
                <span className={cruise.available ? 'status-available' : 'status-unavailable'}>
                  {cruise.available ? 'Доступен для бронирования' : 'Временно недоступен'}
                </span>
              </div>
            </div>

            <div className="cruise-description-card">
              <h3>Подробное описание</h3>
              <p>{cruise.description}</p>
              
              <div className="cruise-features">
                <h4>Особенности круиза:</h4>
                <ul>
                  <li>Комфортабельные каюты</li>
                  <li>Полный пансион</li>
                  <li>Развлекательная программа</li>
                  <li>Экскурсии в портах</li>
                  <li>Спа и фитнес центры</li>
                </ul>
              </div>
              
              <div className="contact-info">
                <h4>Как забронировать?</h4>
                <p>Для бронирования этого круиза вы можете:</p>
                <ul>
                  <li>Добавить круиз в корзину и оформить заказ</li>
                  <li>Связаться с нами по телефону или через форму обратной связи</li>
                  <li>Посетить наш офис для личной консультации</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cruise-cta">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3>Готовы забронировать этот круиз?</h3>
            <p>Свяжитесь с нами для получения дополнительной информации и оформления бронирования</p>
            <div className="cta-buttons">
              {cruise.available && (
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

export default CruiseDetailPage;
