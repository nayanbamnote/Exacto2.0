import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';

/**
 * Container interface representing a draggable/resizable element on the canvas
 */
export type Container = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  styles: {
    backgroundColor: string;
    border: string;
    zIndex: number;
    // Other style properties can be added here
  };
  parentId: string | null;
  children: string[];
};

/**
 * Store state interface
 */
interface CanvasState {
  containers: Record<string, Container>;
  
  // CRUD Operations
  addContainer: (partialContainer?: Partial<Container>) => string;
  updateContainer: (id: string, updates: Partial<Container>) => void;
  removeContainer: (id: string) => void;
  
  // Nesting/Hierarchy functionality
  nestContainer: (childId: string, parentId: string) => void;
  unnestContainer: (childId: string) => void;
  
  // Container query methods
  getContainerById: (id: string) => Container | undefined;
  getChildContainers: (parentId: string) => Container[];
  getRootContainers: () => Container[];
  getAllContainers: () => Container[];
}

/**
 * Default container properties
 */
const DEFAULT_CONTAINER: Omit<Container, 'id'> = {
  x: 0,
  y: 0,
  width: 200,
  height: 100,
  rotation: 0,
  styles: {
    backgroundColor: '#ffffff',
    border: '1px solid #cccccc',
    zIndex: 1,
  },
  parentId: null,
  children: [],
};

/**
 * Canvas store with container management logic
 */
export const useCanvasStore = create<CanvasState>()(
  immer((set, get) => ({
    containers: {},

    /**
     * Add a new container with default or custom properties
     */
    addContainer: (partialContainer: Partial<Container> = {}) => {
      const id = nanoid();
      
      set((state) => {
        state.containers[id] = {
          ...DEFAULT_CONTAINER,
          ...partialContainer,
          id,
        };
        
        // Log the new container
        console.log('Added container:', state.containers[id]);
      });
      
      return id;
    },

    /**
     * Update an existing container with partial properties
     */
    updateContainer: (id: string, updates: Partial<Container>) => {
      set((state) => {
        const container = state.containers[id];
        if (container) {
          // Check if there are actual changes to avoid unnecessary updates
          let hasChanges = false;
          
          // Check primitive props for changes
          for (const key in updates) {
            if (key !== 'styles' && 
                updates[key as keyof Partial<Container>] !== 
                container[key as keyof Container]) {
              hasChanges = true;
              break;
            }
          }
          
          // Check style props for changes if updates includes styles
          if (!hasChanges && updates.styles) {
            const updatedStyles = updates.styles as Partial<Container['styles']>;
            for (const styleKey in updatedStyles) {
              if (styleKey in container.styles &&
                  updatedStyles[styleKey as keyof Container['styles']] !== 
                  container.styles[styleKey as keyof Container['styles']]) {
                hasChanges = true;
                break;
              }
            }
          }
          
          // Only update if there are actual changes
          if (hasChanges) {
            state.containers[id] = {
              ...container,
              ...updates,
              styles: {
                ...container.styles,
                ...(updates.styles || {}),
              },
            };
            
            // Log the updated container
            console.log('Updated container:', id, 'with updates:', updates);
            console.log('Container after update:', state.containers[id]);
          }
        }
      });
    },

    /**
     * Remove a container and clean up parent-child relationships
     */
    removeContainer: (id: string) => {
      set((state) => {
        const container = state.containers[id];
        
        if (!container) return;
        
        // Log the container being removed
        console.log('Removing container:', container);
        
        // Remove from parent's children array if it has a parent
        if (container.parentId) {
          const parent = state.containers[container.parentId];
          if (parent) {
            parent.children = parent.children.filter((childId) => childId !== id);
          }
        }
        
        // Remove all children recursively
        const removeChildrenRecursively = (containerId: string) => {
          const cont = state.containers[containerId];
          if (!cont) return;
          
          // Remove all children first
          [...cont.children].forEach((childId) => {
            removeChildrenRecursively(childId);
          });
          
          // Delete the container
          delete state.containers[containerId];
        };
        
        // Recursively remove all children
        [...container.children].forEach((childId) => {
          removeChildrenRecursively(childId);
        });
        
        // Remove the container itself
        delete state.containers[id];
      });
    },

    /**
     * Nest a container inside another container
     */
    nestContainer: (childId: string, parentId: string) => {
      set((state) => {
        const child = state.containers[childId];
        const parent = state.containers[parentId];
        
        if (!child || !parent || childId === parentId) return;
        
        // Log nesting operation
        console.log(`Nesting container ${childId} inside ${parentId}`);
        
        // Remove from previous parent if exists
        if (child.parentId) {
          const prevParent = state.containers[child.parentId];
          if (prevParent) {
            prevParent.children = prevParent.children.filter((id) => id !== childId);
          }
        }
        
        // Update the child's parent reference
        child.parentId = parentId;
        
        // Add child to new parent's children array if not already there
        if (!parent.children.includes(childId)) {
          parent.children.push(childId);
        }
        
        // Log the updated parent and child
        console.log('Updated child:', child);
        console.log('Updated parent:', parent);
      });
    },

    /**
     * Remove a container from its parent (unnest it)
     */
    unnestContainer: (childId: string) => {
      set((state) => {
        const child = state.containers[childId];
        if (!child || !child.parentId) return;
        
        const parent = state.containers[child.parentId];
        
        // Log unnesting operation
        console.log(`Unnesting container ${childId} from parent ${child.parentId}`);
        
        if (parent) {
          // Remove child from parent's children array
          parent.children = parent.children.filter((id) => id !== childId);
        }
        
        // Remove parent reference from child
        child.parentId = null;
        
        // Log the updated child
        console.log('Updated child after unnesting:', child);
      });
    },

    /**
     * Get a container by its ID
     */
    getContainerById: (id: string) => {
      return get().containers[id];
    },

    /**
     * Get all children of a specific container
     */
    getChildContainers: (parentId: string) => {
      const { containers } = get();
      const parent = containers[parentId];
      
      if (!parent) return [];
      
      return parent.children
        .map((childId) => containers[childId])
        .filter(Boolean) as Container[];
    },

    /**
     * Get all root-level containers (containers with no parent)
     */
    getRootContainers: () => {
      const { containers } = get();
      const rootContainers = Object.values(containers).filter(
        (container) => container.parentId === null
      );
      
      // Log all root containers
      console.log('Root containers:', rootContainers);
      
      return rootContainers;
    },

    /**
     * Get all containers in the store
     */
    getAllContainers: () => {
      const allContainers = Object.values(get().containers);
      console.log('All containers:', allContainers);
      return allContainers;
    },
  }))
); 