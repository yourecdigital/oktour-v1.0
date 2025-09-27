import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  BooleanField,
  EditButton,
  DeleteButton,
  ShowButton,
  Filter,
  SearchInput,
  SelectInput,
  ReferenceInput,
  ChipField,
  FunctionField,
} from 'react-admin';
import { Chip } from '@mui/material';

const TourFilter = (props: any) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <ReferenceInput source="categoryId" reference="categories" label="Category">
      <SelectInput optionText="name" />
    </ReferenceInput>
    <SelectInput
      source="isActive"
      choices={[
        { id: true, name: 'Active' },
        { id: false, name: 'Inactive' },
      ]}
    />
  </Filter>
);

const TourList = (props: any) => (
  <List
    {...props}
    filters={<TourFilter />}
    sort={{ field: 'createdAt', order: 'DESC' }}
    perPage={25}
  >
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <NumberField source="price" options={{ style: 'currency', currency: 'USD' }} />
      <TextField source="duration" />
      <TextField source="location" />
      <FunctionField
        label="Category"
        render={(record: any) => (
          <Chip
            label={record.category?.name || 'No Category'}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
      />
      <BooleanField source="isActive" />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export default TourList;

