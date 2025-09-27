import React from 'react';
import styled, { css } from 'styled-components';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  outline: none;

  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  ${({ size = 'medium' }) => {
    switch (size) {
      case 'small':
        return css`
          padding: 8px 16px;
          font-size: 14px;
          height: 32px;
        `;
      case 'large':
        return css`
          padding: 16px 32px;
          font-size: 18px;
          height: 48px;
        `;
      default:
        return css`
          padding: 12px 24px;
          font-size: 16px;
          height: 40px;
        `;
    }
  }}

  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: #6b7280;
          color: white;
          &:hover:not(:disabled) {
            background-color: #4b5563;
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: #3b82f6;
          border: 2px solid #3b82f6;
          &:hover:not(:disabled) {
            background-color: #3b82f6;
            color: white;
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: #3b82f6;
          &:hover:not(:disabled) {
            background-color: #f3f4f6;
          }
        `;
      default:
        return css`
          background-color: #3b82f6;
          color: white;
          &:hover:not(:disabled) {
            background-color: #2563eb;
          }
        `;
    }
  }}

  ${({ disabled, loading }) =>
    (disabled || loading) &&
    css`
      opacity: 0.6;
      cursor: not-allowed;
    `}
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  loading,
  disabled,
  ...props
}) => {
  return (
    <StyledButton disabled={disabled || loading} {...props}>
      {loading ? 'Loading...' : children}
    </StyledButton>
  );
};

