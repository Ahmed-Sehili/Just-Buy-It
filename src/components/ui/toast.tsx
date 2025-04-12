"use client";

import React, { useState, useEffect } from "react";
import { X, ShoppingCart, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function Toast({
  message,
  type = "success",
  duration = 3000,
  isOpen,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <X className="h-5 w-5" />,
    info: <ShoppingCart className="h-5 w-5" />,
  };

  const bgColors = {
    success: "bg-green-100 text-green-800 border-green-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-xs transition-all duration-300 ease-in-out transform translate-y-0 opacity-100">
      <div
        className={cn(
          "rounded-md shadow-md border p-4 flex items-center gap-3",
          bgColors[type]
        )}
      >
        <div className="shrink-0">{icons[type]}</div>
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="ml-auto shrink-0 hover:opacity-70 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const [isOpen, setIsOpen] = useState(false);
  const [toastProps, setToastProps] = useState<
    Omit<ToastProps, "isOpen" | "onClose">
  >({
    message: "",
    type: "success",
    duration: 3000,
  });

  const toast = (
    message: string,
    type: "success" | "error" | "info" = "success",
    duration = 3000
  ) => {
    setToastProps({ message, type, duration });
    setIsOpen(true);
  };

  const closeToast = () => {
    setIsOpen(false);
  };

  return {
    toast,
    toastProps,
    isOpen,
    closeToast,
  };
}

// Create the context with a more specific type
const ToastContext = React.createContext<{
  toast: (
    message: string,
    type?: "success" | "error" | "info",
    duration?: number
  ) => void;
} | null>(null);
  

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toast, toastProps, isOpen, closeToast } = useToast();
  // Add client-side only rendering for toast
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {isMounted && (
        <Toast {...toastProps} isOpen={isOpen} onClose={closeToast} />
      )}
    </ToastContext.Provider>
  );
}

export const useToastContext = () => {
  const context = React.useContext(ToastContext);
  // Return a dummy toast function if context is not available
  // This prevents the undefined error while maintaining functionality
  if (!context) {
    return {
      toast: () => {
        console.warn('Toast was called outside of ToastProvider');
      }
    };
  }
  return context;
};
