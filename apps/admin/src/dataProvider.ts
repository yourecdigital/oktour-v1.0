import { DataProvider, fetchUtils } from 'react-admin';
import { env } from './env';

const httpClient = (url: string, options: any = {}) => {
  const token = localStorage.getItem('admin_token');
  
  const customHeaders = {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
    ...options.headers,
  };

  return fetchUtils.fetchJson(url, {
    ...options,
    headers: customHeaders,
  });
};

const dataProvider: DataProvider = {
  getList: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      page: page,
      limit: perPage,
      sort: `${field}:${order}`,
      ...params.filter,
    };
    
    const url = `${env.VITE_API_URL}/api/${resource}?${new URLSearchParams(query).toString()}`;
    return httpClient(url).then(({ json }) => ({
      data: json[resource] || json,
      total: json.pagination?.total || json.length,
    }));
  },

  getOne: (resource, params) => {
    return httpClient(`${env.VITE_API_URL}/api/${resource}/${params.id}`).then(({ json }) => ({
      data: json,
    }));
  },

  getMany: (resource, params) => {
    const query = `filter=${JSON.stringify({ id: { in: params.ids } })}`;
    return httpClient(`${env.VITE_API_URL}/api/${resource}?${query}`).then(({ json }) => ({
      data: json[resource] || json,
    }));
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      page: page,
      limit: perPage,
      sort: `${field}:${order}`,
      [`filter.${params.target}`]: params.id,
    };
    
    const url = `${env.VITE_API_URL}/api/${resource}?${new URLSearchParams(query).toString()}`;
    return httpClient(url).then(({ json }) => ({
      data: json[resource] || json,
      total: json.pagination?.total || json.length,
    }));
  },

  create: (resource, params) => {
    return httpClient(`${env.VITE_API_URL}/api/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: json.id },
    }));
  },

  update: (resource, params) => {
    return httpClient(`${env.VITE_API_URL}/api/${resource}/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: json,
    }));
  },

  updateMany: (resource, params) => {
    const query = `filter=${JSON.stringify({ id: { in: params.ids } })}`;
    return httpClient(`${env.VITE_API_URL}/api/${resource}?${query}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: params.ids,
    }));
  },

  delete: (resource, params) => {
    return httpClient(`${env.VITE_API_URL}/api/${resource}/${params.id}`, {
      method: 'DELETE',
    }).then(({ json }) => ({
      data: json,
    }));
  },

  deleteMany: (resource, params) => {
    const query = `filter=${JSON.stringify({ id: { in: params.ids } })}`;
    return httpClient(`${env.VITE_API_URL}/api/${resource}?${query}`, {
      method: 'DELETE',
    }).then(({ json }) => ({
      data: params.ids,
    }));
  },
};

export default dataProvider;

