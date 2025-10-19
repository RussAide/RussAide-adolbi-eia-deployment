import { createContext, useContext, useState, ReactNode } from "react";

interface EIAContextType {
  currentModule: string;
  currentPage: string;
  contextData: Record<string, any>;
  setContext: (module: string, page: string, data?: Record<string, any>) => void;
}

const EIAContext = createContext<EIAContextType | undefined>(undefined);

export function EIAProvider({ children }: { children: ReactNode }) {
  const [currentModule, setCurrentModule] = useState("dashboard");
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [contextData, setContextData] = useState<Record<string, any>>({});

  const setContext = (module: string, page: string, data?: Record<string, any>) => {
    setCurrentModule(module);
    setCurrentPage(page);
    // Always update contextData - clear if no data provided
    setContextData(data || {});
  };

  return (
    <EIAContext.Provider value={{ currentModule, currentPage, contextData, setContext }}>
      {children}
    </EIAContext.Provider>
  );
}

export function useEIAContext() {
  const context = useContext(EIAContext);
  if (!context) {
    throw new Error("useEIAContext must be used within EIAProvider");
  }
  return context;
}

