import React from 'react';
import styled, { css } from 'styled-components';

export interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const StyledCard = styled.div<CardProps>`
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;

  ${({ padding = 'medium' }) => {
    switch (padding) {
      case 'none':
        return css`
          padding: 0;
        `;
      case 'small':
        return css`
          padding: 12px;
        `;
      case 'large':
        return css`
          padding: 24px;
        `;
      default:
        return css`
          padding: 16px;
        `;
    }
  }}

  ${({ variant = 'default' }) => {
    switch (variant) {
      case 'elevated':
        return css`
          background-color: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          &:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
        `;
      case 'outlined':
        return css`
          background-color: white;
          border: 1px solid #e5e7eb;
          &:hover {
            border-color: #d1d5db;
          }
        `;
      default:
        return css`
          background-color: white;
          border: 1px solid #f3f4f6;
        `;
    }
  }}

  ${({ onClick }) =>
    onClick &&
    css`
      cursor: pointer;
      &:hover {
        transform: translateY(-2px);
      }
    `}
`;

export const Card: React.FC<CardProps> = ({ children, ...props }) => {
  return <StyledCard {...props}>{children}</StyledCard>;
};
