import { default as React } from 'react';

export interface HeroVideoProps {
    src: string;
    poster?: string;
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    controls?: boolean;
    className?: string;
    onLoad?: () => void;
    onError?: (error: string) => void;
}
export declare const HeroVideo: React.FC<HeroVideoProps>;
//# sourceMappingURL=HeroVideo.d.ts.map