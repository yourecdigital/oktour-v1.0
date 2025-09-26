import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';

const Container = styled.div`
  padding: 20px;
  min-height: 100vh;
  background: #1e293b;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h2`
  color: #ffffff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BackButton = styled.button`
  background: #6b7280;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: #4b5563;
    transform: translateY(-2px);
  }
`;

const UserInfoCard = styled.div`
  background: rgba(30, 41, 59, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
`;

const UserInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const InfoLabel = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
`;

const InfoValue = styled.span`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  
  ${props => {
    switch (props.$status) {
      case 'new':
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      case 'client':
        return `
          background: #dbeafe;
          color: #1e40af;
        `;
      case 'regular':
        return `
          background: #d1fae5;
          color: #065f46;
        `;
      default:
        return `
          background: #f3f4f6;
          color: #374151;
        `;
    }
  }}
`;

const ActionsSection = styled.div`
  background: rgba(30, 41, 59, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
`;

const SectionTitle = styled.h3`
  color: #ffffff;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  margin-right: 10px;
  margin-bottom: 10px;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #3b82f6;
          color: white;
          &:hover { background: #2563eb; transform: translateY(-2px); }
        `;
      case 'success':
        return `
          background: #10b981;
          color: white;
          &:hover { background: #059669; transform: translateY(-2px); }
        `;
      case 'warning':
        return `
          background: #f59e0b;
          color: white;
          &:hover { background: #d97706; transform: translateY(-2px); }
        `;
      case 'info':
        return `
          background: #06b6d4;
          color: white;
          &:hover { background: #0891b2; transform: translateY(-2px); }
        `;
      default:
        return `
          background: #6b7280;
          color: white;
          &:hover { background: #4b5563; transform: translateY(-2px); }
        `;
    }
  }}
`;

const OrdersSection = styled.div`
  background: rgba(30, 41, 59, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
`;

const OrderCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  backdrop-filter: blur(10px);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const OrderId = styled.span`
  font-weight: 600;
  color: #ffffff;
  font-size: 16px;
`;

const OrderDate = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
`;

const OrderDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OrderAmount = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #059669;
`;

const OrderStatus = styled.span<{ $status: string }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => {
    switch (props.$status) {
      case 'pending':
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      case 'completed':
        return `
          background: #d1fae5;
          color: #065f46;
        `;
      case 'cancelled':
        return `
          background: #fee2e2;
          color: #991b1b;
        `;
      default:
        return `
          background: #f3f4f6;
          color: #374151;
        `;
    }
  }}
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: rgba(30, 41, 59, 0.98);
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(25px);
`;

const ModalTitle = styled.h3`
  color: #ffffff;
  margin: 0 0 20px 0;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Input = styled.input`
  width: 100px;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  phone_number?: string;
  telephone?: string;
  bonus_points: number;
  created_at: string;
  orders_count: number;
}

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  item_id: number;
  item_type: string;
  quantity: number;
  price: number;
}

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [bonusAmount, setBonusAmount] = useState('');
  const [bonusAction, setBonusAction] = useState<'add' | 'deduct'>('add');

  useEffect(() => {
    if (id && !isNaN(parseInt(id))) {
      fetchUser();
      fetchUserOrders();
    } else {
      setLoading(false);
      setUser(null);
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      // Получаем всех пользователей и находим нужного по ID
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      const foundUser = response.data.find((user: User) => user.id === parseInt(id || '0'));
      if (foundUser) {
        // console.log('Found user data:', foundUser); // Отладочная информация
        
        // Получаем количество заказов для пользователя
        try {
          const ordersResponse = await axios.get(`http://localhost:5000/api/admin/user/${foundUser.id}/orders`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
          });
          // console.log('Orders response:', ordersResponse.data); // Отладочная информация
          foundUser.orders_count = ordersResponse.data.length;
        } catch (error) {
          // console.log('Error fetching orders:', error); // Отладочная информация
          foundUser.orders_count = 0;
        }
        
        setUser(foundUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Ошибка загрузки пользователя');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    if (!id) return;
    
    setOrdersLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/user/${id}/orders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      // console.log('fetchUserOrders response:', response.data); // Отладочная информация
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      // Не показываем ошибку, если пользователь не найден - просто пустой список заказов
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const getUserStatus = (ordersCount: number) => {
    if (ordersCount >= 2) return 'regular';
    if (ordersCount === 1) return 'client';
    return 'new';
  };

  const getUserStatusText = (ordersCount: number) => {
    if (ordersCount >= 2) return '💎 Постоянный клиент';
    if (ordersCount === 1) return '⭐ Клиент';
    return '🌟 Новый пользователь';
  };

  const handleBonusClick = (action: 'add' | 'deduct') => {
    setBonusAction(action);
    setBonusAmount('');
    setShowBonusModal(true);
  };

  const handleBonusSubmit = async () => {
    if (!user || !bonusAmount) return;
    
    const points = parseInt(bonusAmount);
    if (!points || points <= 0) {
      toast.error('Введите корректное количество бонусов');
      return;
    }

    // Проверяем, что у пользователя достаточно бонусов для списания
    if (bonusAction === 'deduct' && user.bonus_points < points) {
      toast.error('Недостаточно бонусов для списания');
      return;
    }

    try {
      const endpoint = bonusAction === 'add' ? '/api/admin/bonus/add' : '/api/admin/bonus/deduct';
      const reason = bonusAction === 'add' ? 'Бонус от администратора' : 'Списание администратором';
      
      await axios.post(`http://localhost:5000${endpoint}`, {
        userId: user.id,
        points,
        reason
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      toast.success(`${bonusAction === 'add' ? 'Начислено' : 'Списано'} ${points} бонусов пользователю ${user.name}`);
      setShowBonusModal(false);
      setBonusAmount('');
      fetchUser(); // Обновляем данные пользователя
    } catch (error) {
      console.error('Error managing bonus:', error);
      toast.error(`Ошибка ${bonusAction === 'add' ? 'начисления' : 'списания'} бонусов`);
    }
  };

  const closeBonusModal = () => {
    setShowBonusModal(false);
    setBonusAmount('');
  };

  if (loading) {
    return (
      <Container>
        <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Загрузка пользователя...</div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <Header>
          <Title>Пользователь не найден</Title>
          <BackButton onClick={() => navigate('/admin/dashboard?section=clients')}>
            ← Назад к списку клиентов
          </BackButton>
        </Header>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          👤 {user.name}
          <StatusBadge $status={getUserStatus(user.orders_count)}>
            {getUserStatusText(user.orders_count)}
          </StatusBadge>
        </Title>
        <BackButton onClick={() => navigate('/admin/dashboard?section=clients')}>
          ← Назад к списку клиентов
        </BackButton>
      </Header>

      <UserInfoCard>
        <SectionTitle>📋 Информация о пользователе</SectionTitle>
        <UserInfoGrid>
          <InfoItem>
            <InfoLabel>ID пользователя</InfoLabel>
            <InfoValue>#{user.id}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Имя</InfoLabel>
            <InfoValue>{user.name}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Email</InfoLabel>
            <InfoValue>{user.email}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Телефон</InfoLabel>
            <InfoValue>{user.phone || user.phone_number || user.telephone || 'Не указан'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Дата регистрации</InfoLabel>
            <InfoValue>{new Date(user.created_at).toLocaleDateString('ru-RU')}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Количество заказов</InfoLabel>
            <InfoValue>{user.orders_count || 0}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Бонусные баллы</InfoLabel>
            <InfoValue style={{ color: '#f59e0b' }}>{user.bonus_points.toLocaleString()}</InfoValue>
          </InfoItem>
        </UserInfoGrid>
      </UserInfoCard>

      <ActionsSection>
        <SectionTitle>⚙️ Управление бонусами</SectionTitle>
        <div>
          <Button
            variant="success"
            onClick={() => handleBonusClick('add')}
          >
            ➕ Начислить бонусы
          </Button>
          <Button
            variant="warning"
            onClick={() => handleBonusClick('deduct')}
            disabled={user.bonus_points === 0}
          >
            ➖ Списать бонусы
          </Button>
          <Button
            variant="info"
            onClick={fetchUserOrders}
          >
            🔄 Обновить заказы
          </Button>
        </div>
      </ActionsSection>

      <OrdersSection>
        <SectionTitle>📦 История заказов</SectionTitle>
        {ordersLoading ? (
          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Загрузка заказов...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255, 255, 255, 0.8)' }}>
            У пользователя пока нет заказов
          </div>
        ) : (
          <div>
            {orders.map(order => (
              <OrderCard key={order.id}>
                <OrderHeader>
                  <OrderId>Заказ #{order.id}</OrderId>
                  <OrderDate>{new Date(order.created_at).toLocaleString('ru-RU')}</OrderDate>
                </OrderHeader>
                <OrderDetails>
                  <OrderAmount>{order.total_amount.toLocaleString()} ₽</OrderAmount>
                  <OrderStatus $status={order.status}>
                    {order.status === 'pending' ? 'Ожидает' : 
                     order.status === 'completed' ? 'Завершен' : 
                     order.status === 'cancelled' ? 'Отменен' : order.status}
                  </OrderStatus>
                </OrderDetails>
              </OrderCard>
            ))}
          </div>
        )}
      </OrdersSection>

      {/* Модальное окно для управления бонусами */}
      {showBonusModal && (
        <Modal onClick={closeBonusModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>
              {bonusAction === 'add' ? 'Начислить бонусы' : 'Списать бонусы'} пользователю {user.name}
            </ModalTitle>
            
            <Form>
              <div>
                <p style={{ margin: '0 0 10px 0', color: 'rgba(255, 255, 255, 0.8)' }}>
                  Текущие бонусы: <strong style={{ color: '#f59e0b' }}>{user.bonus_points.toLocaleString()}</strong>
                </p>
              </div>
              
              <InputGroup>
                <label style={{ color: '#ffffff', fontWeight: '500' }}>
                  Количество бонусов:
                </label>
                <Input
                  type="number"
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(e.target.value)}
                  placeholder="0"
                  min="1"
                />
              </InputGroup>
              
              <ButtonGroup>
                <Button variant="secondary" onClick={closeBonusModal}>
                  Отмена
                </Button>
                <Button 
                  variant={bonusAction === 'add' ? 'success' : 'warning'}
                  onClick={handleBonusSubmit}
                >
                  {bonusAction === 'add' ? 'Начислить' : 'Списать'}
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default UserDetailPage;
