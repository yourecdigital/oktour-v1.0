import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('../pages/HomePage'));
const ToursPage = React.lazy(() => import('../pages/ToursPage'));
const TourDetailPage = React.lazy(() => import('../pages/TourDetailPage'));
const ContactPage = React.lazy(() => import('../pages/ContactPage'));
const AboutPage = React.lazy(() => import('../pages/AboutPage'));
const NotFoundPage = React.lazy(() => import('../pages/NotFoundPage'));

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

// Wrapper component for page transitions
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageWrapper>
              <HomePage />
            </PageWrapper>
          </Suspense>
        } 
      />
      <Route 
        path="/tours" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageWrapper>
              <ToursPage />
            </PageWrapper>
          </Suspense>
        } 
      />
      <Route 
        path="/tours/:id" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageWrapper>
              <TourDetailPage />
            </PageWrapper>
          </Suspense>
        } 
      />
      <Route 
        path="/contact" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageWrapper>
              <ContactPage />
            </PageWrapper>
          </Suspense>
        } 
      />
      <Route 
        path="/about" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageWrapper>
              <AboutPage />
            </PageWrapper>
          </Suspense>
        } 
      />
      <Route 
        path="*" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageWrapper>
              <NotFoundPage />
            </PageWrapper>
          </Suspense>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
