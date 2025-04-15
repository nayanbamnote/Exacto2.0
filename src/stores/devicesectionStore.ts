import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DevicePreset {
  name: string;
  width: number;
  height: number;
  id: string;
}

export const devicePresets: Record<string, DevicePreset> = {
  mobileS: { id: 'mobileS', name: 'Mobile S', width: 320, height: 568 },
  mobileM: { id: 'mobileM', name: 'Mobile M', width: 375, height: 667 },
  mobileL: { id: 'mobileL', name: 'Mobile L', width: 425, height: 896 },
  tablet: { id: 'tablet', name: 'Tablet', width: 768, height: 1024 },
  laptop: { id: 'laptop', name: 'Laptop', width: 1024, height: 768 },
  desktop: { id: 'desktop', name: 'Desktop', width: 1440, height: 900 },
};

interface CanvasState {
  selectedDevice: string;
  zoomLevel: number;
  canvasWidth: number;
  canvasHeight: number;
  setSelectedDevice: (device: string) => void;
  setZoomLevel: (level: number) => void;
  incrementZoom: () => void;
  decrementZoom: () => void;
  resetZoom: () => void;
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set) => ({
      selectedDevice: 'desktop',
      zoomLevel: 1,
      canvasWidth: devicePresets.desktop.width,
      canvasHeight: devicePresets.desktop.height,
      
      setSelectedDevice: (device) => 
        set((state) => ({
          selectedDevice: device,
          canvasWidth: devicePresets[device].width,
          canvasHeight: devicePresets[device].height,
        })),
      
      setZoomLevel: (level) => 
        set({ zoomLevel: Math.max(0.1, Math.min(5, level)) }),
      
      incrementZoom: () => 
        set((state) => ({ 
          zoomLevel: Math.min(5, state.zoomLevel + 0.1) 
        })),
      
      decrementZoom: () => 
        set((state) => ({ 
          zoomLevel: Math.max(0.1, state.zoomLevel - 0.1) 
        })),
      
      resetZoom: () => 
        set({ zoomLevel: 1 }),
    }),
    {
      name: 'device-settings-storage', // unique name for localStorage key
      partialize: (state) => ({
        selectedDevice: state.selectedDevice,
        zoomLevel: state.zoomLevel,
      }),
    }
  )
); 