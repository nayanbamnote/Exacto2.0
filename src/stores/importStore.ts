import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { useCanvasStore, Container } from './canvasStore';

interface ImportState {
  importStatus: 'idle' | 'processing' | 'success' | 'error';
  errorMessage: string | null;
  setImportStatus: (status: ImportState['importStatus'], errorMsg?: string) => void;
  importCode: (htmlString: string) => void;
}

/**
 * Parses an HTML string and extracts container data
 */
function parseHTMLToContainers(htmlString: string): Record<string, Container> | null {
  try {
    // Create a DOMParser to parse the HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    // Check for parsing errors
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      throw new Error('Invalid HTML format');
    }
    
    // Get all elements with IDs (our containers)
    const elements = doc.querySelectorAll('[id]');
    if (elements.length === 0) {
      throw new Error('No elements with IDs found in the HTML');
    }
    
    // Create a mapping of elements
    const containers: Record<string, Container> = {};
    
    // First pass: Create all container objects
    elements.forEach((element) => {
      const id = element.id;
      if (!id) return;
      
      // Get inline styles
      const styleAttr = element.getAttribute('style') || '';
      const styleObj: Record<string, string> = {};
      
      // Parse inline styles into object
      styleAttr.split(';').forEach((style) => {
        const [property, value] = style.split(':').map(s => s.trim());
        if (property && value) {
          styleObj[property] = value;
        }
      });
      
      // Extract position, dimensions and rotation
      const x = parseFloat(styleObj['left']?.replace('px', '') || '0');
      const y = parseFloat(styleObj['top']?.replace('px', '') || '0');
      const width = parseFloat(styleObj['width']?.replace('px', '') || '0');
      const height = parseFloat(styleObj['height']?.replace('px', '') || '0');
      
      // Extract rotation from transform
      let rotation = 0;
      const transform = styleObj['transform'];
      if (transform && transform.includes('rotate')) {
        const rotateMatch = transform.match(/rotate\(([^)]+)\)/);
        if (rotateMatch && rotateMatch[1]) {
          rotation = parseFloat(rotateMatch[1].replace('deg', ''));
        }
      }
      
      // Extract style properties
      const backgroundColor = styleObj['background-color'] || '#ffffff';
      const border = styleObj['border'] || '1px solid #cccccc';
      const zIndex = parseInt(styleObj['z-index'] || '1', 10);
      
      // Create the container object
      containers[id] = {
        id,
        x,
        y,
        width,
        height,
        rotation,
        styles: {
          backgroundColor,
          border,
          zIndex,
        },
        parentId: null, // Will be set in second pass
        children: [], // Will be populated in second pass
      };
    });
    
    // Second pass: Establish parent-child relationships
    elements.forEach((element) => {
      const childId = element.id;
      if (!childId || !containers[childId]) return;
      
      // Find the immediate parent with an ID
      let parent: Element | null = element.parentElement;
      while (parent && !parent.id) {
        parent = parent.parentElement;
      }
      
      // If parent has an ID and is not the body, establish relationship
      if (parent && parent.id && parent !== doc.body && containers[parent.id]) {
        const parentId = parent.id;
        containers[childId].parentId = parentId;
        
        // Add child to parent's children array
        if (!containers[parentId].children.includes(childId)) {
          containers[parentId].children.push(childId);
        }
      }
    });
    
    return containers;
  } catch (error) {
    console.error('Error parsing HTML:', error);
    return null;
  }
}

export const useImportStore = create<ImportState>()(
  immer((set) => ({
    importStatus: 'idle',
    errorMessage: null,
    
    setImportStatus: (status, errorMsg = undefined) => {
      set((state) => {
        state.importStatus = status;
        state.errorMessage = errorMsg || null;
      });
    },
    
    importCode: (htmlString) => {
      // Set status to processing
      set((state) => {
        state.importStatus = 'processing';
        state.errorMessage = null;
      });
      
      try {
        // Parse HTML to container objects
        const containers = parseHTMLToContainers(htmlString);
        
        if (!containers) {
          throw new Error('Failed to parse HTML content');
        }
        
        // Log the final JSON object
        console.log('Parsed HTML into containers:', JSON.stringify(containers, null, 2));
        
        // Access canvas store and clear existing containers
        const canvasStore = useCanvasStore.getState();
        
        // Get existing containers to remove them
        const existingContainers = canvasStore.getAllContainers();
        existingContainers.forEach(container => {
          canvasStore.removeContainer(container.id);
        });
        
        // Add new containers to canvas store
        Object.values(containers).forEach(container => {
          // Only add containers without parents first (root containers)
          if (container.parentId === null) {
            // Create container in canvas store with the original ID
            canvasStore.addContainer({
              id: container.id,
              x: container.x,
              y: container.y,
              width: container.width,
              height: container.height,
              rotation: container.rotation,
              styles: {
                backgroundColor: container.styles.backgroundColor,
                border: container.styles.border,
                zIndex: container.styles.zIndex,
              },
              children: container.children,
              parentId: null,
            });
          }
        });
        
        // Now add child containers - their positions are already relative to their parents
        Object.values(containers).forEach(container => {
          if (container.parentId !== null) {
            // Create child container with the original ID and parent relationship
            canvasStore.addContainer({
              id: container.id,
              x: container.x,  // Position is already relative to parent from HTML parsing
              y: container.y,  // Position is already relative to parent from HTML parsing
              width: container.width,
              height: container.height,
              rotation: container.rotation,
              styles: {
                backgroundColor: container.styles.backgroundColor,
                border: container.styles.border,
                zIndex: container.styles.zIndex,
              },
              children: container.children,
              parentId: container.parentId,
            });
          }
        });
        
        // Set status to success
        set((state) => {
          state.importStatus = 'success';
        });
      } catch (error) {
        console.error('Import error:', error);
        // Set status to error with message
        set((state) => {
          state.importStatus = 'error';
          state.errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        });
      }
    },
  }))
);
