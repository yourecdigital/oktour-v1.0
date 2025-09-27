import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Container = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text};
`;

const TourDetailPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <Title>{t('tourDetail.title')}</Title>
      <p>{t('tourDetail.description')}</p>
    </Container>
  );
};

export default TourDetailPage;

