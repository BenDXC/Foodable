import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Login } from './Login';
import { Register } from './Register';
import { Dashboard } from './Dashboard';
import { FoodBankLocator } from './FoodbankLocator';
import { Rewards } from './Rewards';

export const App: React.FC = () => {
  const isAuthenticated = false; // Replace with auth logic

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route
          path='/dashboard'
          element={isAuthenticated ? <Dashboard /> : <Navigate to='/login' />}
        />
        <Route path='/locator' element={<FoodBankLocator />} />
        <Route path='/rewards' element={<Rewards />} />
        <Route path='*' element={<Navigate to='/dashboard' />} />
      </Routes>
    </BrowserRouter>
  );
};
