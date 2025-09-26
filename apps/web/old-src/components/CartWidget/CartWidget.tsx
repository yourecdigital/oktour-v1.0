import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartWidget.css';

const CartWidget: React.FC = () => {
  const { cartItems, getCartTotal, getCartCount } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleViewCart = () => {
    navigate('/cart');
    setIsExpanded(false);
  };

  const handleCheckout = () => {
    navigate('/cart');
    setIsExpanded(false);
  };

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  return (
    <div className="cart-widget">
      <motion.button
        className="cart-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="cart-icon">
          🛒
          {cartCount > 0 && (
            <motion.span
              className="cart-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {cartCount}
            </motion.span>
          )}
        </div>
        <span className="cart-info">
          <div className="cart-count">{cartCount} товаров</div>
          <div className="cart-total">{new Intl.NumberFormat('ru-RU').format(cartTotal)} ₽</div>
        </span>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="cart-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="cart-dropdown-header">
              <h3>Корзина</h3>
              <button 
                className="close-btn"
                onClick={() => setIsExpanded(false)}
              >
                ✕
              </button>
            </div>

            <div className="cart-dropdown-content">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <p>Корзина пуста</p>
                  <span>Добавьте товары, чтобы увидеть их здесь</span>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cartItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="cart-item">
                        <div className="item-info">
                          <div className="item-name">{item.name}</div>
                          <div className="item-details">
                            <span className="item-type">{item.type}</span>
                            <span className="item-quantity">×{item.quantity}</span>
                          </div>
                        </div>
                        <div className="item-price">
                          {new Intl.NumberFormat('ru-RU').format(item.price * item.quantity)} ₽
                        </div>
                      </div>
                    ))}
                    {cartItems.length > 3 && (
                      <div className="more-items">
                        и еще {cartItems.length - 3} товаров...
                      </div>
                    )}
                  </div>

                  <div className="cart-summary">
                    <div className="summary-row">
                      <span>Итого:</span>
                      <span className="total-price">{new Intl.NumberFormat('ru-RU').format(cartTotal)} ₽</span>
                    </div>
                  </div>

                  <div className="cart-actions">
                    <button className="btn-secondary" onClick={handleViewCart}>
                      Посмотреть корзину
                    </button>
                    <button className="btn-primary" onClick={handleCheckout}>
                      Оформить заказ
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartWidget;











