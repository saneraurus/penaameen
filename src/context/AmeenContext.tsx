"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface AmeenContextValue {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AmeenContext = createContext<AmeenContextValue | undefined>(undefined);

export function AmeenProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <AmeenContext.Provider
      value={{ searchQuery, setSearchQuery: handleSetSearchQuery }}
    >
      {children}
    </AmeenContext.Provider>
  );
}

export function useAmeenContext(): AmeenContextValue {
  const context = useContext(AmeenContext);
  if (!context) {
    throw new Error("useAmeenContext must be used within an AmeenProvider");
  }
  return context;
}
