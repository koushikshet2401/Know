'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminUser, getMe, setAdminAuth, clearAdminAuth, getAdminToken } from './adminApi';

interface AdminContextType {
  admin: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, admin: AdminUser) => void;
  logout: () => void;
  refreshAdmin: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const logout = useCallback(() => {
    clearAdminAuth();
    setAdmin(null);
    setToken(null);
    router.push('/admin/login');
  }, [router]);

  const refreshAdmin = useCallback(async () => {
    const existingToken = getAdminToken();
    if (!existingToken) {
      setAdmin(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      setToken(existingToken);
      const res = await getMe();
      if (res && res.admin) {
        setAdmin(res.admin);
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    refreshAdmin();
  }, [refreshAdmin]);

  const login = (newToken: string, newAdmin: AdminUser) => {
    setAdminAuth(newToken);
    setToken(newToken);
    setAdmin(newAdmin);
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        token,
        isLoading,
        login,
        logout,
        refreshAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
