import React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  BooleanField,
  DateField,
  ImageField,
  FunctionField,
  ChipField,
} from 'react-admin';
import { Chip } from '@mui/material';

const TourShow = (props: any) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <NumberField source="price" options={{ style: 'currency', currency: 'USD' }} />
      <TextField source="duration" />
      <TextField source="location" />
      <FunctionField
        label="Category"
        render={(record: any) => (
          <Chip
            label={record.category?.name || 'No Category'}
            color="primary"
            variant="outlined"
          />
        )}
      />
      <ImageField source="imageUrl" title="Tour Image" />
      <BooleanField source="isActive" />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
    </SimpleShowLayout>
  </Show>
);

export default TourShow;
