import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PARCELS } from '../data/mockData';
import type { Parcel } from '../data/mockData';

interface DataContextType {
  parcels: Parcel[];
  addParcel: (parcel: Parcel) => void;
  addParcelsBulk: (newParcels: Parcel[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [parcels, setParcels] = useState<Parcel[]>(() => {
    const saved = localStorage.getItem('bhoomisight_parcels');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return MOCK_PARCELS;
      }
    }
    return MOCK_PARCELS;
  });

  useEffect(() => {
    localStorage.setItem('bhoomisight_parcels', JSON.stringify(parcels));
  }, [parcels]);

  const addParcel = (parcel: Parcel) => {
    setParcels(prev => [parcel, ...prev]);
  };

  const addParcelsBulk = (newParcels: Parcel[]) => {
    setParcels(prev => [...newParcels, ...prev]);
  };

  return (
    <DataContext.Provider value={{ parcels, addParcel, addParcelsBulk }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
