import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HeroVideo } from './HeroVideo';

// Mock video element methods
const mockPlay = vi.fn();
const mockLoad = vi.fn();

Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: mockPlay,
});

Object.defineProperty(HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: mockLoad,
});

describe('HeroVideo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders video element with correct src', () => {
    render(<HeroVideo src="/test-video.mp4" />);
    
    const video = screen.getByRole('video');
    expect(video).toHaveAttribute('src', '/test-video.mp4');
  });

  it('applies default attributes', () => {
    render(<HeroVideo src="/test-video.mp4" />);
    
    const video = screen.getByRole('video');
    expect(video).toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('loop');
    expect(video).toHaveAttribute('muted');
    expect(video).toHaveAttribute('playsinline');
  });

  it('applies poster when provided', () => {
    render(<HeroVideo src="/test-video.mp4" poster="/poster.jpg" />);
    
    const video = screen.getByRole('video');
    expect(video).toHaveAttribute('poster', '/poster.jpg');
  });

  it('shows controls when specified', () => {
    render(<HeroVideo src="/test-video.mp4" controls />);
    
    const video = screen.getByRole('video');
    expect(video).toHaveAttribute('controls');
  });

  it('calls onLoad when video loads', () => {
    const onLoad = vi.fn();
    render(<HeroVideo src="/test-video.mp4" onLoad={onLoad} />);
    
    const video = screen.getByRole('video');
    fireEvent.loadedData(video);
    
    expect(onLoad).toHaveBeenCalledTimes(1);
  });

  it('calls onError when video fails to load', () => {
    const onError = vi.fn();
    render(<HeroVideo src="/test-video.mp4" onError={onError} />);
    
    const video = screen.getByRole('video');
    fireEvent.error(video);
    
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('applies custom aspect ratio', () => {
    render(<HeroVideo src="/test-video.mp4" aspectRatio="4:3" />);
    
    const container = screen.getByRole('video').parentElement;
    expect(container).toHaveStyle('padding-bottom: 75%');
  });

  it('applies percentage aspect ratio', () => {
    render(<HeroVideo src="/test-video.mp4" aspectRatio="50%" />);
    
    const container = screen.getByRole('video').parentElement;
    expect(container).toHaveStyle('padding-bottom: 50%');
  });

  it('uses default 16:9 aspect ratio', () => {
    render(<HeroVideo src="/test-video.mp4" />);
    
    const container = screen.getByRole('video').parentElement;
    expect(container).toHaveStyle('padding-bottom: 56.25%');
  });

  it('forwards additional props to video element', () => {
    render(
      <HeroVideo 
        src="/test-video.mp4" 
        data-testid="hero-video"
        className="custom-video"
      />
    );
    
    const video = screen.getByTestId('hero-video');
    expect(video).toHaveClass('custom-video');
  });

  it('shows fallback text when video fails', () => {
    render(<HeroVideo src="/test-video.mp4" />);
    
    expect(screen.getByText('Your browser does not support the video tag.')).toBeInTheDocument();
  });
});

