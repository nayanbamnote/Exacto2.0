import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { Container, useCanvasStore } from './canvasStore';

/**
 * Status of code generation process
 */
export type CodeStatus = 'idle' | 'generating' | 'success' | 'error';

/**
 * Interface for the code generation store
 */
interface CodeGenState {
  // Generated code
  generatedCode: string;
  
  // Status of code generation
  codeStatus: CodeStatus;
  errorMessage: string | null;
  
  // Functions
  generateCode: () => void;
  setCodeStatus: (status: CodeStatus, error?: string) => void;
}

/**
 * Generate HTML/CSS code from a container
 */
const generateContainerCode = (
  container: Container, 
  containers: Record<string, Container>, 
  indentLevel: number = 0,
  cumulativeHeight: number = 0
): string => {
  const indent = '  '.repeat(indentLevel);
  const { id, x, y, width, height, styles, children, rotation } = container;
  
  // Generate inline CSS
  const cssProperties = [
    `width: ${width}px`,
    `height: ${height}px`,
    `background-color: ${styles.backgroundColor}`,
    `border: ${styles.border}`,
    `z-index: ${styles.zIndex}`,
    `transform: rotate(${rotation}deg)`,
  ];
  
  // Add positioning based on nesting
  if (container.parentId) {
    cssProperties.push(
      'position: absolute',
      `left: ${x}px`,
      `top: ${y}px`
    );
  } else {
    cssProperties.push(
      'position: relative',
      `left: ${x}px`,
      // Adjust the top position to account for previous containers' heights
      `top: ${y - cumulativeHeight}px`
    );
  }
  
  const cssString = cssProperties.join('; ');
  
  // Generate HTML
  let html = `${indent}<div id="${id}" style="${cssString}">\n`;
  
  // Generate code for children
  if (children.length > 0) {
    // Sort children by z-index
    const sortedChildrenIds = [...children].sort((a, b) => {
      const containerA = containers[a];
      const containerB = containers[b];
      return (containerA?.styles.zIndex || 0) - (containerB?.styles.zIndex || 0);
    });
    
    // Generate HTML for each child
    for (const childId of sortedChildrenIds) {
      const childContainer = containers[childId];
      if (childContainer) {
        html += generateContainerCode(childContainer, containers, indentLevel + 1, 0);
      }
    }
  }
  
  html += `${indent}</div>\n`;
  
  return html;
};

/**
 * Store for code generation
 */
export const useCodeGenStore = create<CodeGenState>()(
  persist(
    immer((set) => ({
      generatedCode: '',
      codeStatus: 'idle',
      errorMessage: null,
      
      /**
       * Generate HTML/CSS code from the canvas containers
       */
      generateCode: () => {
        set((state) => {
          state.codeStatus = 'generating';
          state.errorMessage = null;
        });
        
        try {
          // Access the canvas store to get containers
          const containers = useCanvasStore.getState().containers;
          const rootContainers = useCanvasStore.getState().getRootContainers();
          
          // Start HTML template
          let generatedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Layout</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: sans-serif;
    }
    
    * {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
`;
          
          // Sort root containers by z-index
          const sortedRootContainers = [...rootContainers].sort(
            (a, b) => (a.styles.zIndex || 0) - (b.styles.zIndex || 0)
          );
          
          // Calculate cumulative heights for relative positioning adjustment
          let cumulativeHeight = 0;
          
          // Generate code for each root container with adjusted positioning
          for (const container of sortedRootContainers) {
            generatedHtml += generateContainerCode(container, containers, 1, cumulativeHeight);
            cumulativeHeight += container.height;
          }
          
          // Complete HTML template
          generatedHtml += `</body>
</html>`;
          
          // Update state with generated code
          set((state) => {
            state.generatedCode = generatedHtml;
            state.codeStatus = 'success';
          });
        } catch (error) {
          // Handle errors
          set((state) => {
            state.codeStatus = 'error';
            state.errorMessage = error instanceof Error ? error.message : 'Unknown error during code generation';
          });
        }
      },
      
      /**
       * Set the status of code generation
       */
      setCodeStatus: (status: CodeStatus, error?: string) => {
        set((state) => {
          state.codeStatus = status;
          state.errorMessage = error || null;
        });
      },
    })),
    {
      name: 'codegen-storage', // unique name for localStorage key
      partialize: (state) => ({
        generatedCode: state.generatedCode,
        codeStatus: state.codeStatus,
      }),
    }
  )
); 