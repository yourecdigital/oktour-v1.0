import React, { useRef, useEffect, useState } from 'react';
import { useHeroBackground } from '../../hooks/useHeroBackground';
import './UniversalHeroSection.css';

interface UniversalHeroSectionProps {
  pageName: string;
  title: string;
  subtitle?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

const UniversalHeroSection: React.FC<UniversalHeroSectionProps> = ({
  pageName,
  title,
  subtitle,
  description,
  children,
  className = ''
}) => {
  const { background } = useHeroBackground(pageName);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  
  // Диагностика состояния
  console.log('UniversalHeroSection render:', { 
    pageName, 
    hasBackground: !!background, 
    backgroundType: background?.background_type,
    hasFallback: !!background?.fallback_image_url,
    isVideoLoaded 
  });

  useEffect(() => {
    const video = videoRef.current;
    
    console.log('useEffect triggered:', { 
      hasVideo: !!video, 
      backgroundType: background?.background_type,
      videoSrc: background?.background_image_url,
      fallbackUrl: background?.fallback_image_url
    });
    
    // Сброс состояния при смене фона
    setIsVideoLoaded(false);
    
    if (video && background?.background_type === 'video') {
      
      // Простая функция воспроизведения
      const playVideo = async () => {
        try {
          console.log('Attempting to play video...');
          console.log('Video element state:', {
            src: video.src,
            readyState: video.readyState,
            paused: video.paused,
            muted: video.muted,
            autoplay: video.autoplay,
            loop: video.loop
          });
          
          // Принудительно устанавливаем muted для автовоспроизведения
          video.muted = true;
          
          await video.play();
          console.log('Video play successful');
          setIsVideoLoaded(true);
        } catch (error) {
          console.warn('Video play failed:', error);
          
          // Попытка через задержку
          setTimeout(async () => {
            try {
              if (video.paused) {
                console.log('Retry attempt after 500ms');
                await video.play();
                console.log('Video play successful on retry');
                setIsVideoLoaded(true);
              }
            } catch (retryError) {
              console.error('Video play failed on retry:', retryError);
            }
          }, 500);
        }
      };

      // Обработчики событий
      const handleCanPlay = () => {
        console.log('Video can play');
        playVideo();
      };

      const handlePlaying = () => {
        console.log('Video started playing');
        setIsVideoLoaded(true);
      };

      const handleEnded = () => {
        console.log('Video ended, restarting');
        video.currentTime = 0;
        video.play().catch(console.error);
      };

      const handleError = (e: any) => {
        console.error('Video error:', e);
        setIsVideoLoaded(false);
      };

      // Добавляем обработчики
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('playing', handlePlaying);
      video.addEventListener('ended', handleEnded);
      video.addEventListener('error', handleError);

      // Попробуем запустить видео сразу если оно готово
      if (video.readyState >= 3) {
        playVideo();
      }

      // Дополнительная попытка при загрузке страницы
      const handleLoad = () => {
        console.log('Page loaded, attempting to play video');
        playVideo();
      };

      // Добавляем обработчик загрузки страницы
      window.addEventListener('load', handleLoad);

      // Добавляем обработчики взаимодействия пользователя для обхода ограничений браузера
      const handleUserInteraction = () => {
        console.log('User interaction detected, attempting to play video');
        playVideo();
        // Удаляем обработчики после первого взаимодействия
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      };

      document.addEventListener('click', handleUserInteraction);
      document.addEventListener('touchstart', handleUserInteraction);

      // Cleanup
      return () => {
        window.removeEventListener('load', handleLoad);
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('error', handleError);
      };
    }
  }, [background]);

  // Глобальное отслеживание взаимодействия пользователя для обхода ограничений автовоспроизведения
  useEffect(() => {
    if (hasUserInteracted || !background || background.background_type !== 'video') {
      return;
    }

    const handleGlobalInteraction = () => {
      console.log('Global user interaction detected');
      setHasUserInteracted(true);
      
      const video = videoRef.current;
      if (video && video.paused) {
        console.log('Attempting to play video after user interaction');
        video.play().catch(console.error);
      }
      
      // Удаляем обработчики после первого взаимодействия
      document.removeEventListener('click', handleGlobalInteraction);
      document.removeEventListener('touchstart', handleGlobalInteraction);
      document.removeEventListener('keydown', handleGlobalInteraction);
    };

    document.addEventListener('click', handleGlobalInteraction);
    document.addEventListener('touchstart', handleGlobalInteraction);
    document.addEventListener('keydown', handleGlobalInteraction);

    return () => {
      document.removeEventListener('click', handleGlobalInteraction);
      document.removeEventListener('touchstart', handleGlobalInteraction);
      document.removeEventListener('keydown', handleGlobalInteraction);
    };
  }, [hasUserInteracted, background]);

  // Отладочная информация
  console.log('UniversalHeroSection render:', {
    background,
    isVideoLoaded,
    hasUserInteracted,
    pageName
  });

  return (
    <section className={`universal-hero-section ${className}`}>
      <div className="hero-background">
        {background?.background_image_url ? (
          background.background_type === 'video' ? (
            <>
              {/* Fallback image shown while video is loading */}
              {!isVideoLoaded && background.fallback_image_url && (
                <img 
                  src={`http://localhost:5000${background.fallback_image_url}`}
                  alt={`${title} background`}
                  className="hero-background-image hero-fallback-image"
                  style={{ 
                    opacity: 1,
                    pointerEvents: 'none',
                    cursor: 'default',
                    zIndex: -1,
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
              )}
              <video 
                ref={videoRef}
                src={`http://localhost:5000${background.background_image_url}`}
                className="hero-background-video"
                muted
                autoPlay
                loop
                playsInline
                preload="auto"
                poster={background.fallback_image_url ? `http://localhost:5000${background.fallback_image_url}` : undefined}
                controls={false}
                disablePictureInPicture
                disableRemotePlayback
                crossOrigin="anonymous"
                style={{ 
                  opacity: 1,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  pointerEvents: 'none',
                  cursor: 'default',
                  zIndex: -1,
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                onEnded={() => {
                  console.log('Video ended, restarting via inline handler');
                  const video = videoRef.current;
                  if (video) {
                    video.currentTime = 0;
                    setTimeout(() => {
                      video.play().catch(console.error);
                    }, 100);
                  }
                }}
              />
            </>
          ) : (
            <img 
              src={`http://localhost:5000${background.background_image_url}`}
              alt={`${title} background`}
              className="hero-background-image"
              style={{ 
                pointerEvents: 'none',
                cursor: 'default',
                zIndex: -1,
                position: 'absolute',
                top: 0,
                left: 0
              }}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
          )
        ) : (
          <div className="hero-default-background"></div>
        )}
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text-container">
            <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: title }}></h1>
            {description && <p className="hero-description">{description}</p>}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
};

export default UniversalHeroSection;
