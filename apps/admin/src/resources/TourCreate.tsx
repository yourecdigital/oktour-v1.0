import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  ReferenceInput,
  SelectInput,
  ImageInput,
  ImageField,
  required,
  minValue,
} from 'react-admin';

const TourCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="title" validate={required()} />
      <TextInput source="description" multiline rows={4} />
      <NumberInput
        source="price"
        validate={[required(), minValue(0)]}
        options={{ style: 'currency', currency: 'USD' }}
      />
      <TextInput source="duration" />
      <TextInput source="location" />
      <ReferenceInput source="categoryId" reference="categories" validate={required()}>
        <SelectInput optionText="name" />
      </ReferenceInput>
      <ImageInput source="imageUrl" label="Tour Image" accept="image/*">
        <ImageField source="src" title="title" />
      </ImageInput>
      <BooleanInput source="isActive" defaultValue={true} />
    </SimpleForm>
  </Create>
);

export default TourCreate;

