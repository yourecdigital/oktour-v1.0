import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';


const AdminContainer = styled.div`
  min-height: 100vh;
  background: #1e293b;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  background: #1e293b;
  color: #ffffff;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(20px);
  border-bottom: 3px solid rgba(255, 255, 255, 0.2);
`;

const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const TopBarButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(15px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
  }
`;

const NavigationBar = styled.div`
  background: rgba(30, 41, 59, 0.95);
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  position: sticky;
  top: 72px;
  z-index: 99;
  backdrop-filter: blur(20px);
`;

const NavButton = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  color: #ffffff;
  border: 2px solid ${props => props.$active ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)'};
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.3s ease;
  backdrop-filter: blur(15px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
  }
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
`;

const Sidebar = styled.aside`
  width: 280px;
  background: rgba(30, 41, 59, 0.95);
  border-right: 2px solid rgba(255, 255, 255, 0.2);
  padding: 2rem 0;
  position: sticky;
  top: 144px;
  height: calc(100vh - 144px);
  overflow-y: auto;
  backdrop-filter: blur(20px);
`;

const SidebarSection = styled.div`
  margin-bottom: 2rem;
`;

const SidebarTitle = styled.h3`
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 1rem 2rem;
  opacity: 0.8;
`;

const CategoryFilter = styled.div`
  padding: 0 2rem;
`;

const CategoryTitle = styled.h4`
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
`;

const CategoryButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CategoryButton = styled.div<{ $active?: boolean }>`
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  color: #ffffff;
  border: 2px solid ${props => props.$active ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)'};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: left;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(15px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
  }
`;

const DeleteButton = styled.button`
  background: rgba(239, 68, 68, 0.9);
  color: #ffffff;
  border: 2px solid rgba(239, 68, 68, 0.3);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-left: 0.5rem;
  backdrop-filter: blur(15px);

  &:hover {
    background: rgba(220, 38, 38, 0.95);
    border-color: rgba(239, 68, 68, 0.5);
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: rgba(30, 41, 59, 0.98);
  padding: 2rem;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  min-height: 120vh;
  max-height: 120vh;
  text-align: center;
  backdrop-filter: blur(25px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
`;

const ModalTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #ffffff;
`;

const ModalText = styled.p`
  margin: 0 0 1.5rem 0;
  color: #ffffff;
  opacity: 0.8;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ModalButton = styled.button<{ $danger?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: 2px solid ${props => props.$danger ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.3)'};
  background: ${props => props.$danger ? 'rgba(239, 68, 68, 0.9)' : 'rgba(255, 255, 255, 0.1)'};
  color: #ffffff;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(15px);

  &:hover {
    background: ${props => props.$danger ? 'rgba(220, 38, 38, 0.95)' : 'rgba(255, 255, 255, 0.2)'};
    border-color: ${props => props.$danger ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.5)'};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
  }
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const currentSection = searchParams.get('section') || 'tours';
  const currentCategory = searchParams.get('category') || 'Все';
  const [selectedCategory, setSelectedCategory] = useState<string>(currentCategory);
  const [categories, setCategories] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string>('');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navigationItems = [
    { name: 'Туры по России', section: 'tours', icon: '🏔️' },
    { name: 'Зарубежные туры', section: 'foreign', icon: '✈️' },
    { name: 'Круизы', section: 'cruises', icon: '🚢' },
    { name: 'Горящие предложения', section: 'promotions', icon: '🔥' },
    { name: 'Наши услуги', section: 'services', icon: '🛠️' },
    { name: 'Отели и гостиницы', section: 'hotels', icon: '🏨' },
    { name: 'Клиенты', section: 'clients', icon: '👥' },
    { name: 'Фоны страниц', section: 'hero-backgrounds', icon: '🖼️' },
  ];

  // Функция для получения категорий в зависимости от текущей секции
  const fetchCategories = async () => {
    try {
      let endpoint = '';
      switch (currentSection) {
        case 'tours':
          endpoint = '/api/tours';
          break;
        case 'foreign':
          endpoint = '/api/foreign-tours';
          break;
        case 'cruises':
          endpoint = '/api/cruises';
          break;
        case 'promotions':
          endpoint = '/api/promotions';
          break;
        case 'services':
          endpoint = '/api/services';
          break;
        case 'hotels':
          endpoint = '/api/hotels';
          break;
        default:
          endpoint = '/api/tours';
      }

      const response = await axios.get(`'http://localhost:5000'${endpoint}`);
      
      if (currentSection === 'foreign') {
        // Для зарубежных туров показываем страны
        const uniqueCountries = Array.from(new Set(
          response.data
            .map((item: any) => item.country)
            .filter(Boolean)
        )) as string[];
        setCategories(['Все', ...uniqueCountries]);
      } else {
        // Для остальных секций показываем категории
        const uniqueCategories = Array.from(new Set(
          response.data
            .map((item: any) => item.category)
            .filter(Boolean)
        )) as string[];
        setCategories(['Все', ...uniqueCategories]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(['Все']);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentSection]);

  // Синхронизируем состояние с URL при изменении параметров
  useEffect(() => {
    setSelectedCategory(currentCategory);
  }, [currentCategory]);

  const handleSectionChange = (section: string) => {
    navigate(`/admin/dashboard?section=${section}`);
    setSelectedCategory('Все');
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Передаем выбранную категорию в дочерний компонент через URL
    navigate(`/admin/dashboard?section=${currentSection}&category=${category}`);
  };

  const handleDeleteCategory = (category: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем срабатывание onClick родительской кнопки
    if (category === 'Все') return; // Нельзя удалить "Все"
    
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDeleteCategory = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.error('No admin token found');
        return;
      }

      let endpoint = '';
      let fieldName = '';
      
      switch (currentSection) {
        case 'tours':
          endpoint = '/api/tours';
          fieldName = 'category';
          break;
        case 'foreign':
          endpoint = '/api/foreign-tours';
          fieldName = 'country';
          break;
        case 'cruises':
          endpoint = '/api/cruises';
          fieldName = 'category';
          break;
        case 'promotions':
          endpoint = '/api/promotions';
          fieldName = 'category';
          break;
        case 'services':
          endpoint = '/api/services';
          fieldName = 'category';
          break;
        case 'hotels':
          endpoint = '/api/hotels';
          fieldName = 'category';
          break;
        default:
          endpoint = '/api/tours';
          fieldName = 'category';
      }

      // Удаляем все элементы с данной категорией/страной
      const response = await axios.delete(`${endpoint}/category/${encodeURIComponent(categoryToDelete)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        // Обновляем список категорий
        await fetchCategories();
        setSelectedCategory('Все');
        navigate(`/admin/dashboard?section=${currentSection}&category=Все`);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Ошибка при удалении категории');
    } finally {
      setShowDeleteModal(false);
      setCategoryToDelete('');
    }
  };

  const cancelDeleteCategory = () => {
    setShowDeleteModal(false);
    setCategoryToDelete('');
  };

  return (
    <AdminContainer>
      <TopBar>
        <TopBarLeft>
          <Logo>Админ панель</Logo>
        </TopBarLeft>
        <TopBarRight>
          <TopBarButton onClick={() => navigate('/')}>
            🏠 На главную страницу
          </TopBarButton>
          <TopBarButton onClick={handleLogout}>
            🚪 Выход
          </TopBarButton>
        </TopBarRight>
      </TopBar>

      <NavigationBar>
        {navigationItems.map((item, index) => (
          <NavButton
            key={index}
            $active={currentSection === item.section}
            onClick={() => handleSectionChange(item.section)}
          >
            {item.icon} {item.name}
          </NavButton>
        ))}
      </NavigationBar>

      <MainContent>
        {currentSection !== 'hero-backgrounds' && currentSection !== 'clients' && (
          <Sidebar>
            <SidebarSection>
              <CategoryFilter>
                <CategoryTitle>
                  {currentSection === 'foreign' ? 'Фильтр по странам' : 'Фильтр по категориям'}
                </CategoryTitle>
                <CategoryButtons>
                  {categories.map((category, index) => (
                    <CategoryButton
                      key={index}
                      $active={selectedCategory === category}
                      onClick={() => handleCategoryChange(category)}
                    >
                      <span>{category}</span>
                      {category !== 'Все' && (
                        <DeleteButton
                          onClick={(e) => handleDeleteCategory(category, e)}
                          title={`Удалить ${currentSection === 'foreign' ? 'страну' : 'категорию'} "${category}"`}
                        >
                          🗑️
                        </DeleteButton>
                      )}
                    </CategoryButton>
                  ))}
                </CategoryButtons>
              </CategoryFilter>
            </SidebarSection>
          </Sidebar>
        )}

        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>

      {/* Модальное окно подтверждения удаления */}
      {showDeleteModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>Подтверждение удаления</ModalTitle>
            <ModalText>
              Вы точно хотите удалить {currentSection === 'foreign' ? 'страну' : 'категорию'} "{categoryToDelete}"?
              <br />
              <strong>Это действие удалит все объекты в этой {currentSection === 'foreign' ? 'стране' : 'категории'} и не может быть отменено!</strong>
            </ModalText>
            <ModalButtons>
              <ModalButton onClick={cancelDeleteCategory}>
                Отмена
              </ModalButton>
              <ModalButton $danger onClick={confirmDeleteCategory}>
                Удалить
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
    </AdminContainer>
  );
};

export default AdminLayout;
