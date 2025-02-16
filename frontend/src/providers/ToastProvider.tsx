'use client';
import React, { type PropsWithChildren, useContext, useCallback } from 'react';
import { Bounce, toast } from 'react-toastify';

const ToastContext = React.createContext({
  showToast: (value: any, type?: string) => {},
});

export const ToastProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const showToast = useCallback((value: any, type: string = 'light') => {
    toast(value, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: type,
      transition: Bounce,
    });
  }, []);

  return (
    <ToastContext.Provider
      value={{
        showToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within an ToastProvider');
  }
  return context;
}
