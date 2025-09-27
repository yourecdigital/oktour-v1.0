import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useDataProvider, useNotify } from 'react-admin';
import { env } from '../env';

interface HeroBackground {
  id: number;
  page: string;
  type: 'IMAGE' | 'VIDEO';
  url: string;
  thumbnailUrl?: string;
  fallbackUrl?: string;
  isActive: boolean;
  order: number;
}

const HeroBackgroundManager: React.FC = () => {
  const [backgrounds, setBackgrounds] = useState<HeroBackground[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<HeroBackground | null>(null);
  const [formData, setFormData] = useState({
    page: '',
    type: 'IMAGE' as 'IMAGE' | 'VIDEO',
    url: '',
    thumbnailUrl: '',
    fallbackUrl: '',
    isActive: true,
    order: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const dataProvider = useDataProvider();
  const notify = useNotify();

  // Load backgrounds
  const loadBackgrounds = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await dataProvider.getList('hero', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'order', order: 'ASC' },
        filter: {},
      });
      setBackgrounds(data);
    } catch (error) {
      notify('Failed to load hero backgrounds', { type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [dataProvider, notify]);

  React.useEffect(() => {
    loadBackgrounds();
  }, [loadBackgrounds]);

  // File upload handler
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', file);

      // Upload to MinIO
      const response = await fetch(`${env.VITE_API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { imageUrl } = await response.json();
      setFormData(prev => ({ ...prev, url: imageUrl }));
      setSnackbar({ open: true, message: 'File uploaded successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Upload failed', severity: 'error' });
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.ogg'],
    },
    multiple: false,
  });

  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (editing) {
        await dataProvider.update('hero', {
          id: editing.id,
          data: formData,
        });
        notify('Hero background updated successfully', { type: 'success' });
      } else {
        await dataProvider.create('hero', {
          data: formData,
        });
        notify('Hero background created successfully', { type: 'success' });
      }
      
      setOpen(false);
      setEditing(null);
      setFormData({
        page: '',
        type: 'IMAGE',
        url: '',
        thumbnailUrl: '',
        fallbackUrl: '',
        isActive: true,
        order: 0,
      });
      loadBackgrounds();
    } catch (error) {
      notify('Failed to save hero background', { type: 'error' });
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this hero background?')) {
      try {
        await dataProvider.delete('hero', { id });
        notify('Hero background deleted successfully', { type: 'success' });
        loadBackgrounds();
      } catch (error) {
        notify('Failed to delete hero background', { type: 'error' });
      }
    }
  };

  // Handle edit
  const handleEdit = (background: HeroBackground) => {
    setEditing(background);
    setFormData({
      page: background.page,
      type: background.type,
      url: background.url,
      thumbnailUrl: background.thumbnailUrl || '',
      fallbackUrl: background.fallbackUrl || '',
      isActive: background.isActive,
      order: background.order,
    });
    setOpen(true);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Hero Background Manager</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Background
        </Button>
      </Box>

      <Grid container spacing={3}>
        {backgrounds.map((background) => (
          <Grid item xs={12} sm={6} md={4} key={background.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6">{background.page}</Typography>
                  <Box>
                    <IconButton size="small" onClick={() => handleEdit(background)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(background.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Box mb={2}>
                  <Chip
                    label={background.type}
                    color={background.type === 'VIDEO' ? 'primary' : 'secondary'}
                    size="small"
                  />
                  <Chip
                    label={background.isActive ? 'Active' : 'Inactive'}
                    color={background.isActive ? 'success' : 'default'}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Box>

                {background.url && (
                  <Box mb={2}>
                    {background.type === 'IMAGE' ? (
                      <img
                        src={background.url}
                        alt={background.page}
                        style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }}
                      />
                    ) : (
                      <video
                        src={background.url}
                        style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }}
                        controls
                      />
                    )}
                  </Box>
                )}

                <Typography variant="body2" color="text.secondary">
                  Order: {background.order}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editing ? 'Edit Hero Background' : 'Add Hero Background'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Page"
                  value={formData.page}
                  onChange={(e) => setFormData(prev => ({ ...prev, page: e.target.value }))}
                  placeholder="e.g., home, tours, about"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'IMAGE' | 'VIDEO' }))}
                  >
                    <MenuItem value="IMAGE">Image</MenuItem>
                    <MenuItem value="VIDEO">Video</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value as boolean }))}
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* File Upload */}
              <Grid item xs={12}>
                <Box
                  {...getRootProps()}
                  sx={{
                    border: '2px dashed',
                    borderColor: isDragActive ? 'primary.main' : 'grey.300',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: isDragActive ? 'action.hover' : 'background.paper',
                  }}
                >
                  <input {...getInputProps()} />
                  <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    {isDragActive ? 'Drop the file here' : 'Drag & drop a file here, or click to select'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supports: {formData.type === 'IMAGE' ? 'JPEG, PNG, GIF, WebP' : 'MP4, WebM, OGG'}
                  </Typography>
                  {uploading && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Uploading...
                    </Alert>
                  )}
                </Box>
              </Grid>

              {formData.url && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Preview:
                  </Typography>
                  {formData.type === 'IMAGE' ? (
                    <img
                      src={formData.url}
                      alt="Preview"
                      style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8 }}
                    />
                  ) : (
                    <video
                      src={formData.url}
                      style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8 }}
                      controls
                    />
                  )}
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="Or enter URL manually"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Thumbnail URL"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                  placeholder="Optional thumbnail URL"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Fallback URL"
                  value={formData.fallbackUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, fallbackUrl: e.target.value }))}
                  placeholder="Optional fallback URL"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HeroBackgroundManager;

