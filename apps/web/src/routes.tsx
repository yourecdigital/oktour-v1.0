import React, { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import Home from './screens/Home';

const AdminApp = lazy(() => import('./screens/admin/AdminApp'));

const routes: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/admin/*', element: <Suspense fallback={null}><AdminApp /></Suspense> },
];

export default routes;




