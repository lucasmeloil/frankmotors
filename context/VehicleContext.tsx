'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Vehicle } from '@/lib/types';

interface VehicleContextType {
  vehicles: Vehicle[];
  loading: boolean;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  refreshVehicles: () => Promise<void>;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export function VehicleProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehiclesFromAPI = async () => {
    try {
      const res = await fetch('/api/vehicles?pageSize=100');
      const data = await res.json();
      return data.vehicles || [];
    } catch (e) {
      console.error('API Error, continuing with local data only', e);
      return [];
    }
  };

  const refreshVehicles = async () => {
    setLoading(true);
    const apiVehicles = await fetchVehiclesFromAPI();
    
    // Merge with local storage (local storage has priority for manual changes)
    const localData = localStorage.getItem('frank_motors_vehicles');
    const localVehicles: Vehicle[] = localData ? JSON.parse(localData) : [];
    
    // Simple merge: local vehicles take precedence if IDs match, otherwise combine
    const merged = [...localVehicles];
    apiVehicles.forEach((apiV: Vehicle) => {
      if (!merged.find(v => v.id === apiV.id)) {
        merged.push(apiV);
      }
    });

    setVehicles(merged);
    setLoading(false);
  };

  useEffect(() => {
    refreshVehicles();
  }, []);

  const saveToLocal = (updatedVehicles: Vehicle[]) => {
    setVehicles(updatedVehicles);
    localStorage.setItem('frank_motors_vehicles', JSON.stringify(updatedVehicles.filter(v => typeof v.id === 'string' && v.id.startsWith('local_'))));
  };

  const addVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `local_${Date.now()}`,
      created_at: new Date().toISOString()
    };
    const updated = [newVehicle, ...vehicles];
    saveToLocal(updated);
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    const updated = vehicles.map(v => v.id === id ? { ...v, ...updates } : v);
    saveToLocal(updated);
  };

  const deleteVehicle = (id: string) => {
    const updated = vehicles.filter(v => v.id !== id);
    saveToLocal(updated);
  };

  return (
    <VehicleContext.Provider value={{ vehicles, loading, addVehicle, updateVehicle, deleteVehicle, refreshVehicles }}>
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicles() {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error('useVehicles must be used within a VehicleProvider');
  }
  return context;
}
