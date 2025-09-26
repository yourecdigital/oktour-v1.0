import { AuthProvider } from 'react-admin';
import { env } from './env';

const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    try {
      const response = await fetch(`${env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const { token, user } = await response.json();
      
      if (user.role !== 'ADMIN') {
        throw new Error('Admin access required');
      }

      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(user));
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    return Promise.resolve();
  },

  checkAuth: () => {
    const token = localStorage.getItem('admin_token');
    return token ? Promise.resolve() : Promise.reject();
  },

  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getIdentity: () => {
    try {
      const user = localStorage.getItem('admin_user');
      return user ? Promise.resolve(JSON.parse(user)) : Promise.reject();
    } catch (error) {
      return Promise.reject();
    }
  },

  getPermissions: () => {
    try {
      const user = localStorage.getItem('admin_user');
      if (user) {
        const { role } = JSON.parse(user);
        return Promise.resolve(role);
      }
      return Promise.reject();
    } catch (error) {
      return Promise.reject();
    }
  },
};

export default authProvider;
