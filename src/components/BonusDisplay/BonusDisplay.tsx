import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';


const BonusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 20px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
  }
`;

const BonusIcon = styled.span`
  font-size: 16px;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;

const BonusAmount = styled.span`
  font-weight: 700;
  font-size: 16px;
`;

const BonusDetails = styled.div`
  position: relative;
`;

const Tooltip = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 400;
  white-space: nowrap;
  opacity: ${props => props.$show ? 1 : 0};
  visibility: ${props => props.$show ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &::before {
    content: '';
    position: absolute;
    bottom: 100%;
    right: 16px;
    border: 6px solid transparent;
    border-bottom-color: rgba(0, 0, 0, 0.9);
  }
`;

interface BonusDisplayProps {
  showTooltip?: boolean;
  className?: string;
}

const BonusDisplay: React.FC<BonusDisplayProps> = ({ showTooltip = true, className }) => {
  const { user, token } = useAuth();
  const [bonusPoints, setBonusPoints] = useState<number>(0);
  const [ordersCount, setOrdersCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [showBonusTooltip, setShowBonusTooltip] = useState(false);

  useEffect(() => {
    if (user) {
      setBonusPoints(user.bonusPoints || 0);
      fetchOrdersCount();
    }
  }, [user]);

  const fetchOrdersCount = async () => {
    if (!token) return;
    
    try {
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setOrdersCount(response.data.length);
    } catch (error) {
      console.error('Error fetching orders count:', error);
    }
  };

  const refreshBonusPoints = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const [bonusResponse, ordersResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/bonus/points', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      setBonusPoints(bonusResponse.data.bonus_points);
      setOrdersCount(ordersResponse.data.length);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBonusMessage = () => {
    // Определяем статус на основе заказов
    if (ordersCount >= 2) {
      return `💎 Постоянный клиент! У вас ${ordersCount} заказов. Используйте бонусы для скидок!`;
    } else if (ordersCount === 1) {
      return `⭐ Клиент! Вы оформили ${ordersCount} заказ. Оформите еще один для статуса "Постоянный клиент"!`;
    } else {
      return `🌟 Новый пользователь! Оформите первый заказ, чтобы стать клиентом!`;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <BonusDetails className={className}>
      <BonusContainer
        onClick={refreshBonusPoints}
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => setShowBonusTooltip(true)}
        onMouseLeave={() => setShowBonusTooltip(false)}
      >
        <BonusIcon>🎁</BonusIcon>
        <BonusAmount>
          {loading ? '...' : (bonusPoints || 0).toLocaleString()}
        </BonusAmount>
        <span>бонусов</span>
      </BonusContainer>
      
      {showTooltip && (
        <Tooltip $show={showBonusTooltip}>
          {getBonusMessage()}
        </Tooltip>
      )}
    </BonusDetails>
  );
};

export default BonusDisplay;
