import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';
import { uploadLocally } from '../../utils/uploadUtils';
import './HeroBackgroundManager.css';


const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  color: #1e293b;
  margin: 0 0 20px 0;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
`;

const ModalTitle = styled.h3`
  color: #1e293b;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  
  &:hover {
    color: #374151;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'danger' | 'secondary' }>`
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  margin-right: 10px;
  
  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: #3b82f6;
          color: white;
          &:hover { background: #2563eb; }
        `;
      case 'danger':
        return `
          background: #ef4444;
          color: white;
          &:hover { background: #dc2626; }
        `;
      default:
        return `
          background: #6b7280;
          color: white;
          &:hover { background: #4b5563; }
        `;
    }
  }}
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #d1d5db;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PreviewVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FrameCaptureSection = styled.div`
  margin-top: 15px;
  padding: 15px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const FrameCaptureTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
`;

const FrameCaptureButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const CaptureButton = styled.button`
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const UploadFrameButton = styled.button`
  padding: 8px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: #059669;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const CapturedFramePreview = styled.div`
  width: 100%;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #d1d5db;
`;

const CapturedFrameImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UploadButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 10px;
  
  &:hover {
    background: #059669;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const SaveButton = styled.button<{ $hasImage?: boolean }>`
  background: ${props => props.$hasImage ? '#10b981' : '#3b82f6'};
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(0);
  transition: all 0.3s ease;
  margin-top: 20px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    background: ${props => props.$hasImage ? '#059669' : '#2563eb'};
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const WarningMessage = styled.div`
  background: #fef3c7;
  border: 1px solid #f59e0b;
  color: #92400e;
  padding: 12px;
  border-radius: 8px;
  margin-top: 15px;
  font-size: 14px;
`;

interface HeroBackground {
  id?: number;
  page_name: string;
  background_image_url: string | null;
  background_type: 'image' | 'video';
  created_at?: string;
  updated_at?: string;
}

const KNOWN_PAGES = [
  { value: 'home', label: 'Главная страница' },
  { value: 'tours', label: 'Туры по России' },
  { value: 'hotels', label: 'Отели' },
  { value: 'foreign', label: 'Зарубежные туры' },
  { value: 'cruises', label: 'Круизы' },
  { value: 'promotions', label: 'Акции' },
  { value: 'services', label: 'Услуги' },
  { value: 'contacts', label: 'Контакты' }
];

const HeroBackgroundManager: React.FC = () => {
  const [backgrounds, setBackgrounds] = useState<HeroBackground[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBackground, setEditingBackground] = useState<HeroBackground | null>(null);
  
  // Form state
  const [pageName, setPageName] = useState('home');
  const [backgroundType, setBackgroundType] = useState<'image' | 'video'>('image');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Video frame capture state
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);
  const [capturingFrame, setCapturingFrame] = useState(false);

  useEffect(() => {
    fetchBackgrounds();
  }, []);

  const fetchBackgrounds = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/hero-backgrounds');
      setBackgrounds(response.data || []);
    } catch (error) {
      console.error('Error fetching backgrounds:', error);
      toast.error('Ошибка загрузки фонов');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (background: HeroBackground) => {
    setEditingBackground(background);
    setPageName(background.page_name);
    setBackgroundType(background.background_type);
    setSelectedFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingBackground(null);
    setPageName('home');
    setBackgroundType('image');
    setSelectedFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBackground(null);
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Создаем локальный preview для отображения
      const reader = new FileReader();
      reader.onload = (e) => {
        // Не перезаписываем imagePreview, если файл уже загружен на сервер
        if (!imagePreview || imagePreview.startsWith('data:')) {
          setImagePreview(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    const token = localStorage.getItem('adminToken');

    try {
      // Используем локальную загрузку (S3 API временно отключен)
      const imageUrl = await uploadLocally(selectedFile, token || '');
      toast.success('Файл успешно загружен!');
      setImagePreview(imageUrl);
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Ошибка загрузки файла');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!imagePreview) {
      toast.error('Пожалуйста, загрузите изображение или видео');
      return;
    }

    // Check if imagePreview is a data URL (local preview)
    if (imagePreview.startsWith('data:')) {
      toast.error('Пожалуйста, сначала загрузите файл на сервер');
      return;
    }

    setSaving(true);
    try {
      // Ensure URL starts with /uploads
      const normalizedUrl = imagePreview.startsWith('/uploads')
        ? imagePreview
        : `/uploads/${imagePreview.replace(/^\/?uploads\/?/, '')}`;

      const backgroundData = {
        page_name: pageName,
        background_image_url: normalizedUrl,
        background_type: backgroundType,
        fallback_image_url: capturedFrame && !capturedFrame.startsWith('data:') ? capturedFrame : null
      };


      const response = await axios.post('http://localhost:5000/api/hero-backgrounds', backgroundData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Save response:', response.data);
      toast.success(editingBackground ? 'Фон обновлен!' : 'Фон создан!');
      await fetchBackgrounds();
      handleCloseModal();
    } catch (error: any) {
      console.error('Save error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(`Ошибка сохранения фона: ${error.response?.data?.error || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Video frame capture functions
  const handleVideoLoad = (video: HTMLVideoElement | null) => {
    console.log('Video element loaded:', video);
    setVideoRef(video);
  };

  const captureFrame = async () => {
    if (!videoRef) {
      console.error('Video ref not available');
      toast.error('Видео не загружено');
      return;
    }

    if (videoRef.videoWidth === 0 || videoRef.videoHeight === 0) {
      console.error('Video dimensions not available');
      toast.error('Видео еще не готово, подождите немного');
      return;
    }

    setCapturingFrame(true);
    try {
      console.log('Capturing frame from video:', videoRef.videoWidth, 'x', videoRef.videoHeight);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      canvas.width = videoRef.videoWidth;
      canvas.height = videoRef.videoHeight;

      // Clear canvas first
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the video frame
      ctx.drawImage(videoRef, 0, 0, canvas.width, canvas.height);

      // Check if canvas is tainted
      try {
        ctx.getImageData(0, 0, 1, 1);
      } catch (e) {
        throw new Error('Canvas is tainted due to CORS restrictions. Please ensure the video is served with proper CORS headers.');
      }

      const frameDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      console.log('Frame captured, data URL length:', frameDataUrl.length);

      setCapturedFrame(frameDataUrl);
      toast.success('Кадр успешно захвачен!');
    } catch (error) {
      console.error('Frame capture error:', error);
      if (error instanceof Error && error.message.includes('tainted')) {
        toast.error('Ошибка CORS: Видео должно быть загружено с правильными заголовками безопасности');
      } else {
        toast.error(`Ошибка захвата кадра: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
      }
    } finally {
      setCapturingFrame(false);
    }
  };

  const uploadFrame = async () => {
    if (!capturedFrame) return;

    setCapturingFrame(true);
    try {
      console.log('Starting frame upload...');
      
      // Convert data URL to blob
      const response = await fetch(capturedFrame);
      const blob = await response.blob();
      
      console.log('Blob created:', blob.size, 'bytes');
      
      const formData = new FormData();
      formData.append('image', blob, 'video-frame.jpg');

      console.log('Uploading to server...');
      
      // Check if we have admin token
      const adminToken = localStorage.getItem('adminToken');
      console.log('Admin token exists:', !!adminToken);
      
      if (!adminToken) {
        throw new Error('Admin token not found. Please login again.');
      }

      const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${adminToken}`
        },
        timeout: 30000 // 30 second timeout
      });

      console.log('Upload response:', uploadResponse.data);

      if (uploadResponse.data && uploadResponse.data.imageUrl) {
        let uploaded = uploadResponse.data.imageUrl;
        
        // Normalize to start with /uploads
        if (!uploaded.startsWith('/uploads')) {
          uploaded = `/uploads/${uploaded.replace(/^\/?uploads\/?/, '')}`;
        }
        
        console.log('Normalized URL:', uploaded);
        setCapturedFrame(uploaded);
        toast.success('Кадр успешно загружен на сервер!');
      } else {
        throw new Error('No imageUrl in response');
      }
    } catch (error: any) {
      console.error('Frame upload error:', error);
      console.error('Error response:', error.response?.data);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          toast.error('Не удается подключиться к серверу. Проверьте, что сервер запущен.');
        } else if (error.response?.status === 401) {
          toast.error('Ошибка авторизации. Пожалуйста, войдите в систему заново.');
        } else if (error.response?.status === 413) {
          toast.error('Файл слишком большой. Попробуйте захватить кадр меньшего размера.');
        } else if (error.response?.data?.error) {
          toast.error(`Ошибка загрузки кадра: ${error.response.data.error}`);
        } else {
          toast.error(`Ошибка загрузки кадра: ${error.message}`);
        }
      } else {
        toast.error(`Ошибка загрузки кадра: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
      }
    } finally {
      setCapturingFrame(false);
    }
  };

  const handleDelete = async (pageName: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот фон?')) {
      return;
    }

    try {
      await axios.delete(`'http://localhost:5000/api/hero-backgrounds/${encodeURIComponent(pageName)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      toast.success('Фон удален!');
      await fetchBackgrounds();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Ошибка удаления фона');
    }
  };

  const getPageLabel = (pageValue: string) => {
    const page = KNOWN_PAGES.find(p => p.value === pageValue);
    return page ? page.label : pageValue;
  };

  if (loading) {
    return (
      <Container>
        <Title>Управление фонами Hero</Title>
        <div>Загрузка...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Title>🖼️ Управление фонами Hero</Title>
      
      <Button $variant="primary" onClick={handleAddNew}>
        Добавить новый фон
      </Button>

      <div className="hero-backgrounds-grid">
        {KNOWN_PAGES.map(page => {
          const background = backgrounds.find(bg => bg.page_name === page.value);
          
          return (
            <div key={page.value} className="hero-background-card">
              <div className="background-info">
                <h3>{page.label}</h3>
                <span className="page-key">{page.value}</span>
                <p className="last-updated">
                  {background?.updated_at 
                    ? `Обновлено: ${new Date(background.updated_at).toLocaleString()}`
                    : 'Фон не установлен'
                  }
                </p>
              </div>
              
              <div className="background-preview">
                {background?.background_image_url ? (
                  background.background_type === 'video' ? (
                    <video 
                      src={`http://localhost:5000${background.background_image_url}`}
                      className="preview-video"
                      muted
                    />
                  ) : (
                    <img 
                      src={`http://localhost:5000${background.background_image_url}`}
                      alt={`${page.label} background`}
                      className="preview-image"
                    />
                  )
                ) : (
                  <div className="no-background">
                    <div className="no-background-icon">🖼️</div>
                    <div>Нет фона</div>
                  </div>
                )}
              </div>
              
              <div className="background-actions">
                <Button 
                  $variant="primary" 
                  onClick={() => handleEdit(background || { page_name: page.value, background_type: 'image', background_image_url: null })}
                >
                  {background ? 'Редактировать' : 'Добавить фон'}
                </Button>
                {background && (
                  <Button 
                    $variant="danger" 
                    onClick={() => handleDelete(page.value)}
                  >
                    Удалить
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <Modal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editingBackground ? 'Редактировать фон' : 'Добавить новый фон'}
              </ModalTitle>
              <CloseButton onClick={handleCloseModal}>×</CloseButton>
            </ModalHeader>

            <FormGroup>
              <Label>Страница</Label>
              <Select 
                value={pageName} 
                onChange={(e) => setPageName(e.target.value)}
                disabled={!!editingBackground}
              >
                {KNOWN_PAGES.map(page => (
                  <option key={page.value} value={page.value}>
                    {page.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Тип фона</Label>
              <Select 
                value={backgroundType} 
                onChange={(e) => setBackgroundType(e.target.value as 'image' | 'video')}
              >
                <option value="image">Изображение</option>
                <option value="video">Видео</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Файл</Label>
              <Input 
                type="file" 
                accept={backgroundType === 'image' ? 'image/*' : 'video/*'}
                onChange={handleFileSelect}
              />
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>
                Максимальный размер файла: 100MB
                {selectedFile && (
                  <span style={{ color: selectedFile.size > 100 * 1024 * 1024 ? '#ef4444' : '#059669' }}>
                    {' '}({Math.round(selectedFile.size / 1024 / 1024)}MB)
                  </span>
                )}
              </div>
              {selectedFile && selectedFile.size > 100 * 1024 * 1024 && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>
                  ⚠️ Файл слишком большой! Максимальный размер: 100MB
                </div>
              )}
              {selectedFile && selectedFile.size <= 100 * 1024 * 1024 && (
                <>
                  <UploadButton onClick={handleUpload} disabled={uploading}>
                    {uploading ? 'Загрузка...' : 'Загрузить файл'}
                  </UploadButton>
                  {imagePreview && (
                    <WarningMessage>
                      ⚠️ Файл загружен! Не забудьте сохранить изменения.
                    </WarningMessage>
                  )}
                </>
              )}
            </FormGroup>

            <ImagePreview>
              {imagePreview ? (
                backgroundType === 'video' ? (
            <PreviewVideo
              ref={handleVideoLoad}
              src={imagePreview.startsWith('data:') ? imagePreview : `'http://localhost:5000'${imagePreview}`}
              controls
              crossOrigin="anonymous"
            />
                ) : (
                  <PreviewImage 
                    src={imagePreview.startsWith('data:') ? imagePreview : `'http://localhost:5000'${imagePreview}`} 
                    alt="Preview" 
                  />
                )
              ) : editingBackground?.background_image_url ? (
                editingBackground.background_type === 'video' ? (
              <PreviewVideo
                ref={handleVideoLoad}
                src={`http://localhost:5000${editingBackground.background_image_url}`}
                controls
                crossOrigin="anonymous"
              />
                ) : (
                  <PreviewImage 
                    src={`http://localhost:5000${editingBackground.background_image_url}`} 
                    alt="Current background" 
                  />
                )
              ) : (
                <div style={{ color: '#6b7280' }}>
                  Выберите файл для предпросмотра
                </div>
              )}
            </ImagePreview>

            {/* Frame capture section for videos */}
            {((imagePreview && backgroundType === 'video') || (editingBackground?.background_type === 'video')) && (
              <FrameCaptureSection>
                <FrameCaptureTitle>
                  📸 Захват кадра для fallback изображения
                </FrameCaptureTitle>
                <FrameCaptureButtons>
                  <CaptureButton 
                    onClick={captureFrame}
                    disabled={capturingFrame || !videoRef}
                  >
                    {capturingFrame ? 'Захват...' : 'Захватить кадр'}
                  </CaptureButton>
                  {capturedFrame && (
                    <UploadFrameButton 
                      onClick={uploadFrame}
                      disabled={capturingFrame}
                    >
                      {capturingFrame ? 'Загрузка...' : 'Загрузить кадр'}
                    </UploadFrameButton>
                  )}
                </FrameCaptureButtons>
                
                {capturedFrame && (
                  <CapturedFramePreview>
                    <CapturedFrameImage 
                      src={capturedFrame.startsWith('data:') ? capturedFrame : `'http://localhost:5000'${capturedFrame}`}
                      alt="Captured frame"
                    />
                  </CapturedFramePreview>
                )}
                
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                  💡 Перемотайте видео на нужный кадр и нажмите "Захватить кадр"
                </div>
              </FrameCaptureSection>
            )}

            <SaveButton 
              onClick={handleSave} 
              disabled={saving || (!imagePreview && !editingBackground?.background_image_url)}
              $hasImage={!!imagePreview}
            >
              {saving ? 'Сохранение...' : 'Сохранить фон'}
            </SaveButton>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default HeroBackgroundManager;
