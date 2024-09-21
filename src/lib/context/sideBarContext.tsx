'use client'
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the interface for the context's value
interface SidebarContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create a context with a default value (which will be overridden by the provider)
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Define the provider component
export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Create a custom hook to use the Sidebar context
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  
  return context;
};
