import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: #1e293b;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.h3`
  color: #64748b;
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 500;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
`;

const ClientsTable = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  background: #f8fafc;
  padding: 15px 20px;
  border-bottom: 1px solid #e2e8f0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 100px 100px 120px;
  gap: 20px;
  font-weight: 600;
  color: #374151;
`;

const TableRow = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #f1f5f9;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 100px 100px 120px;
  gap: 20px;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f8fafc;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' }>`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 12px;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #3b82f6;
          color: white;
          &:hover { background: #2563eb; }
        `;
      case 'info':
        return `
          background: #06b6d4;
          color: white;
          &:hover { background: #0891b2; }
        `;
      case 'success':
        return `
          background: #10b981;
          color: white;
          &:hover { background: #059669; }
        `;
      case 'warning':
        return `
          background: #f59e0b;
          color: white;
          &:hover { background: #d97706; }
        `;
      default:
        return `
          background: #6b7280;
          color: white;
          &:hover { background: #4b5563; }
        `;
    }
  }}
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  
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

const ClientsManager: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      // console.log('API response for users:', response.data); // Отладочная информация
      
      // Добавляем количество заказов для каждого пользователя
      const usersWithOrders = await Promise.all(
        response.data.map(async (user: User) => {
          try {
            const ordersResponse = await axios.get(`http://localhost:5000/api/admin/user/${user.id}/orders`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
              }
            });
            return {
              ...user,
              orders_count: ordersResponse.data.length
            };
          } catch (error) {
            return {
              ...user,
              orders_count: 0
            };
          }
        })
      );
      
      setUsers(usersWithOrders);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Ошибка загрузки клиентов');
    } finally {
      setLoading(false);
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

  const handleViewUser = (user: User) => {
    navigate(`/admin/user/${user.id}`);
  };

  const totalUsers = users.length;
  const newUsers = users.filter(user => getUserStatus(user.orders_count) === 'new').length;
  const clients = users.filter(user => getUserStatus(user.orders_count) === 'client').length;
  const regularClients = users.filter(user => getUserStatus(user.orders_count) === 'regular').length;

  if (loading) {
    return (
      <Container>
        <Title>Управление клиентами</Title>
        <div>Загрузка...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>👥 Управление клиентами</Title>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatTitle>Всего пользователей</StatTitle>
          <StatValue>{totalUsers}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Новых пользователей</StatTitle>
          <StatValue>{newUsers}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Клиентов</StatTitle>
          <StatValue>{clients}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Постоянных клиентов</StatTitle>
          <StatValue>{regularClients}</StatValue>
        </StatCard>
      </StatsGrid>

      <ClientsTable>
        <TableHeader>
          <div>Имя</div>
          <div>Email</div>
          <div>Телефон</div>
          <div>Дата регистрации</div>
          <div>Бонусы</div>
          <div>Заказы</div>
          <div>Действия</div>
        </TableHeader>
        
        {users.map(user => (
          <TableRow key={user.id}>
            <div>
              <div style={{ fontWeight: '600' }}>{user.name}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                <StatusBadge $status={getUserStatus(user.orders_count)}>
                  {getUserStatusText(user.orders_count)}
                </StatusBadge>
              </div>
            </div>
            <div>{user.email}</div>
            <div style={{ 
              color: user.phone ? '#1e293b' : '#64748b',
              fontStyle: user.phone ? 'normal' : 'italic'
            }}>
              {user.phone || user.phone_number || user.telephone || 'Не указан'}
            </div>
            <div>{new Date(user.created_at).toLocaleDateString()}</div>
            <div style={{ 
              color: user.bonus_points > 0 ? '#f59e0b' : '#64748b',
              fontWeight: '600'
            }}>
              {user.bonus_points.toLocaleString()}
            </div>
            <div style={{ 
              color: user.orders_count > 0 ? '#059669' : '#64748b',
              fontWeight: '600'
            }}>
              {user.orders_count}
            </div>
            <div>
              <Button
                variant="primary"
                onClick={() => handleViewUser(user)}
              >
                👤 Открыть профиль
              </Button>
            </div>
          </TableRow>
        ))}
      </ClientsTable>

    </Container>
  );
};

export default ClientsManager;







