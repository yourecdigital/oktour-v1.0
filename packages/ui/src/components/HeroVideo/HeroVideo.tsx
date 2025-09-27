import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

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

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  z-index: 1;
`;

export const HeroVideo: React.FC<HeroVideoProps> = ({
  src,
  poster,
  autoplay = true,
  muted = true,
  loop = true,
  controls = false,
  className,
  onLoad,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => {
      setIsLoading(false);
      onLoad?.();
    };
    const handleError = () => {
      const errorMsg = 'Failed to load video';
      setError(errorMsg);
      setIsLoading(false);
      onError?.(errorMsg);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [onLoad, onError]);

  if (error) {
    return (
      <VideoContainer className={className}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          backgroundColor: '#f3f4f6',
          color: '#6b7280'
        }}>
          Video unavailable
        </div>
      </VideoContainer>
    );
  }

  return (
    <VideoContainer className={className}>
      <StyledVideo
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoplay}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline
      />
      {isLoading && (
        <LoadingOverlay>
          Loading video...
        </LoadingOverlay>
      )}
    </VideoContainer>
  );
};

