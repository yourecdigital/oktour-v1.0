import { default as React } from 'react';

export interface CardProps {
    variant?: 'default' | 'elevated' | 'outlined';
    padding?: 'none' | 'small' | 'medium' | 'large';
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}
export declare const Card: React.FC<CardProps>;
//# sourceMappingURL=Card.d.ts.map