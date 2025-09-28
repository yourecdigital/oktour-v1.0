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
import './PromotionsPage.css';


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

const PromotionsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchPromotions = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/promotions');
      setPromotions(response.data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      toast.error('Ошибка загрузки горячих предложений');
    } finally {
      setLoading(false);
    }
  }, []);

  // Автоматическое обновление данных каждые 30 секунд
  useAutoRefresh(fetchPromotions, { interval: 30000 });

  // Первоначальная загрузка
  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  // Получаем категории из базы данных
  const categories = ['Все', ...Array.from(new Set(promotions.map(promotion => promotion.category || '').filter(Boolean)))];

  const filteredPromotions = selectedCategory === 'Все' 
    ? promotions 
    : promotions.filter(promotion => promotion.category === selectedCategory);

  if (loading) {
    return (
      <div className="promotions-page">
        <UniversalHeroSection
          pageName="promotions"
          title="Горячие предложения"
          description="Загрузка горячих предложений..."
        />
      </div>
    );
  }

  const handleAddToCart = async (promotion: Promotion) => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      navigate('/login');
      return;
    }

    try {
      // Для промоций создаем специальный объект
      const promotionItem = {
        id: promotion.id,
        name: promotion.title,
        description: promotion.description,
        price: 0, // Промоции бесплатны
        type: 'promotion'
      };
      await addToCart(promotion.id, 'tour', promotionItem);
    } catch (error) {
      // Error is handled in CartContext
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return (
    <div className="promotions-page">
      <UniversalHeroSection
        pageName="promotions"
        title="Горячие предложения"
        description="Не упустите возможность сэкономить на путешествиях"
      />

      <div className="promotions-container">
        <aside className="filters-sidebar">
          <h3>Категории скидок</h3>
          
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

        <main className="promotions-content">
          <div className="promotions-grid">
            {filteredPromotions.map((promotion, index) => (
              <motion.article
                key={promotion.id}
                className={`promotion-card ${isExpired(promotion.valid_until || '') ? 'expired' : ''}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="promotion-image">
                                  {promotion.image_url ? (
                  <img 
                    src={getImageUrl(promotion.image_url)} 
                    alt={promotion.title} 
                  />
                ) : (
                    <div className="promotion-image-placeholder">
                      {promotion.title.charAt(0)}
                    </div>
                  )}
                  <div className="promotion-discount">-{promotion.discount_percent}%</div>
                  {promotion.valid_until && (
                    <div className="promotion-validity">
                      {isExpired(promotion.valid_until) ? 'Истекло' : `До ${formatDate(promotion.valid_until)}`}
                    </div>
                  )}
                </div>
                <div className="promotion-content">
                  <h3>{promotion.title}</h3>
                  <p className="promotion-description">{promotion.description}</p>
                  {promotion.category && (
                    <div className="promotion-category">
                      🏷️ {promotion.category}
                    </div>
                  )}
                  <button 
                    className="btn-primary"
                    onClick={() => handleAddToCart(promotion)}
                    disabled={isExpired(promotion.valid_until || '')}
                  >
                    {isExpired(promotion.valid_until || '') ? 'Предложение истекло' : 'Получить скидку'}
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PromotionsPage;
