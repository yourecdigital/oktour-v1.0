import axios from 'axios';

interface PresignedUploadResponse {
  url: string;
  fields: Record<string, string>;
  objectUrl: string;
}

export const uploadToS3 = async (file: File, token: string): Promise<string> => {
  try {
    // 1. Получаем presigned URL от API
    const key = `uploads/${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`;
    const contentType = file.type;
    
    const presignResponse = await axios.post('http://localhost:4000/api/media/presign', {
      key,
      contentType
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const { url, fields }: PresignedUploadResponse = presignResponse.data;

    // 2. Загружаем файл напрямую в S3
    const formData = new FormData();
    
    // Добавляем поля от S3
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    // Добавляем файл последним
    formData.append('file', file);

    const uploadResponse = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (uploadResponse.status === 204 || uploadResponse.status === 200) {
      // Возвращаем URL для доступа к файлу
      return `http://localhost:5000/uploads/${key}`;
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('S3 Upload error:', error);
    throw error;
  }
};

// Fallback функция для локальной загрузки (если S3 недоступен)
export const uploadLocally = async (file: File, token: string): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post('http://localhost:5000/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data.success) {
      return response.data.imageUrl;
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Local upload error:', error);
    throw error;
  }
};
