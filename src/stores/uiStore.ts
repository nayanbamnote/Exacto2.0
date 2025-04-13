import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/**
 * UI state interface for managing UI-related state
 */
interface UIState {
  // Selected container
  selectedContainerId: string | null;
  
  // Panel visibility states
  isPropertyPanelVisible: boolean;
  
  // Selection functions
  selectContainer: (id: string | null) => void;
  
  // Panel visibility functions
  togglePropertyPanel: (visible?: boolean) => void;
}

/**
 * UI store for managing UI state
 */
export const useUIStore = create<UIState>()(
  immer((set) => ({
    // Initial state
    selectedContainerId: null,
    isPropertyPanelVisible: false,
    
    /**
     * Select a container by ID or deselect if null
     */
    selectContainer: (id: string | null) => {
      set((state) => {
        state.selectedContainerId = id;
        
        // Automatically show property panel when a container is selected
        if (id && !state.isPropertyPanelVisible) {
          state.isPropertyPanelVisible = true;
        }
      });
    },
    
    /**
     * Toggle the property panel visibility
     * @param visible Optional boolean to explicitly set visibility state
     */
    togglePropertyPanel: (visible?: boolean) => {
      set((state) => {
        if (visible !== undefined) {
          state.isPropertyPanelVisible = visible;
        } else {
          state.isPropertyPanelVisible = !state.isPropertyPanelVisible;
        }
      });
    },
  }))
); 