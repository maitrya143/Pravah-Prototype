import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { getSelectedCenter, setSelectedCenter } from '../utils/api';

interface Center {
  id: number;
  name: string;
  location: string;
  city: string;
  code: string;
}

interface CenterContextType {
  selectedCenter: Center | null;
  centers: Center[];
  setSelectedCenter: (center: Center | null) => void;
  loadCenters: () => Promise<void>;
  loading: boolean;
}

const CenterContext = createContext<CenterContextType | undefined>(undefined);

export const CenterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCenter, setSelectedCenterState] = useState<Center | null>(getSelectedCenter());
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCenters = async () => {
    try {
      setLoading(true);
      const response = await api.getMyCenters();
      setCenters(response.centers || []);
    } catch (error) {
      console.error('Failed to load centers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetSelectedCenter = (center: Center | null) => {
    setSelectedCenterState(center);
    setSelectedCenter(center);
  };

  return (
    <CenterContext.Provider
      value={{
        selectedCenter,
        centers,
        setSelectedCenter: handleSetSelectedCenter,
        loadCenters,
        loading,
      }}
    >
      {children}
    </CenterContext.Provider>
  );
};

export const useCenter = () => {
  const context = useContext(CenterContext);
  if (context === undefined) {
    throw new Error('useCenter must be used within a CenterProvider');
  }
  return context;
};

