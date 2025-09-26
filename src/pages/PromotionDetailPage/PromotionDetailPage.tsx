import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUtils';
import './PromotionDetailPage.css';

interface Promotion {
  id: number;
  title: string;
  description: string;
  discount_percent: number;
  valid_until?: string;
  category?: string;
  image_url?: string;
  active: boolean;
}

const PromotionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchPromotion();
  }, [id]);

  const fetchPromotion = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/promotions/${id}`);
      setPromotion(response.data);
    } catch (error: any) {
      console.error('Error fetching promotion:', error);
      if (error.response?.status === 404) {
        setError('Акция не найдена');
      } else {
        setError('Ошибка загрузки акции');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContactUs = () => {
    navigate('/contact');
  };

  const handleBackClick = () => {
    navigate('/promotions');
  };

  const isExpired = promotion?.valid_until ? new Date(promotion.valid_until) < new Date() : false;

  if (loading) {
    return (
      <div className="promotion-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка акции...</p>
        </div>
      </div>
    );
  }

  if (error || !promotion) {
    return (
      <div className="promotion-detail-page">
        <div className="error-container">
          <h2>Ошибка</h2>
          <p>{error || 'Акция не найдена'}</p>
          <button onClick={handleBackClick} className="btn-primary">
            Вернуться к акциям
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="promotion-detail-page">
      <div className="promotion-hero">
        <div className="promotion-hero-content">
          <motion.button
            onClick={handleBackClick}
            className="back-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Назад к акциям
          </motion.button>
          
          <motion.div
            className="promotion-hero-info"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="promotion-category">{promotion.category || 'Акция'}</div>
            <h1 className="promotion-title">{promotion.title}</h1>
            <p className="promotion-description">{promotion.description}</p>
            
            <div className="promotion-discount-section">
              <div className="discount-badge">
                -{promotion.discount_percent}%
              </div>
              <div className="promotion-status">
                {promotion.active && !isExpired ? (
                  <span className="status-active">✓ Активна</span>
                ) : (
                  <span className="status-inactive">✗ Неактивна</span>
                )}
              </div>
            </div>

            {promotion.valid_until && (
              <div className="validity-info">
                <span className="validity-label">Действует до:</span>
                <span className="validity-date">
                  {new Date(promotion.valid_until).toLocaleDateString('ru-RU')}
                </span>
              </div>
            )}

            {promotion.active && !isExpired && (
              <motion.button
                className="btn-primary contact-btn"
                onClick={handleContactUs}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Узнать подробности
              </motion.button>
            )}
          </motion.div>
        </div>

        {promotion.image_url && (
          <div className="promotion-hero-image">
            <motion.img
              src={getImageUrl(promotion.image_url)}
              alt={promotion.title}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            />
          </div>
        )}
      </div>

      <div className="promotion-details">
        <div className="container">
          <div className="promotion-details-grid">
            <div className="promotion-info-card">
              <h3>Информация об акции</h3>
              <div className="info-item">
                <strong>Название:</strong>
                <span>{promotion.title}</span>
              </div>
              <div className="info-item">
                <strong>Скидка:</strong>
                <span className="discount-highlight">
                  {promotion.discount_percent}%
                </span>
              </div>
              <div className="info-item">
                <strong>Категория:</strong>
                <span>{promotion.category || 'Общие акции'}</span>
              </div>
              {promotion.valid_until && (
                <div className="info-item">
                  <strong>Действует до:</strong>
                  <span>{new Date(promotion.valid_until).toLocaleDateString('ru-RU')}</span>
                </div>
              )}
              <div className="info-item">
                <strong>Статус:</strong>
                <span className={promotion.active && !isExpired ? 'status-active' : 'status-inactive'}>
                  {promotion.active && !isExpired ? 'Активна' : 'Неактивна'}
                </span>
              </div>
            </div>

            <div className="promotion-description-card">
              <h3>Подробное описание</h3>
              <p>{promotion.description}</p>
              
              <div className="promotion-benefits">
                <h4>Преимущества акции:</h4>
                <ul>
                  <li>Значительная экономия средств</li>
                  <li>Высокое качество услуг</li>
                  <li>Гибкие условия бронирования</li>
                  <li>Персональный подход к каждому клиенту</li>
                  <li>Круглосуточная поддержка</li>
                </ul>
              </div>
              
              <div className="contact-info">
                <h4>Как воспользоваться акцией?</h4>
                <p>Для участия в этой акции вы можете:</p>
                <ul>
                  <li>Связаться с нами по телефону или через форму обратной связи</li>
                  <li>Посетить наш офис для личной консультации</li>
                  <li>Заказать обратный звонок</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="promotion-cta">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3>Хотите воспользоваться этой акцией?</h3>
            <p>Свяжитесь с нами прямо сейчас, чтобы узнать подробности и забронировать услугу со скидкой</p>
            <div className="cta-buttons">
              <motion.button
                className="btn-primary"
                onClick={handleContactUs}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Связаться с нами
              </motion.button>
              <motion.button
                className="btn-secondary"
                onClick={() => navigate('/')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Посмотреть другие предложения
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PromotionDetailPage;











