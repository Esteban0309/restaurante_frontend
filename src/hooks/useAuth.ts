// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { getToken } from '../services/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
  }, []);

  return { isAuthenticated };
}
