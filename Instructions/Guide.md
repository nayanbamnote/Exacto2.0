# 🛠️ Application Architecture & Implementation Guide

## 📦 Tech Stack

- **Framework** Next.js (React) with TypeScrit
- **Styling** Tailwind CS
- **Component Library** Shadcn I
- **State Management** Zustand with Immer
- **Drag & Drop** dnd-kit
- **Element Transformation** react-moveable
- **Unique ID Generation** nanoid

## 📚 NPM Libraries

- **@dnd-kit/core*: Provides modular drag-and-drop functionality for React applicatios.
- **react-moveable*: Enables dragging, resizing, and rotating of elements on the canvs.
- **nanoid*: Generates unique IDs for containers and elemens.
- **zustand*: Lightweight state management solution for Reat.
- **immer*: Facilitates immutable state updates with a more straightforward syntx.
- **clsx*: Utility for conditionally joining classNames togethr.
- **tailwindcss*: Utility-first CSS framework for rapid UI developmet.
- **shadcn/ui*: Pre-built UI components compatible with Tailwind CS.

## 🗂️ Zustand Stores

### 1. `canvasStore.ts`

**Purpose*: Manages the global container tree, including each container’s properties and hierarchical relationshps.

**Functions**:
- `addContainer(container: Containr)`
- `updateContainer(id: string, updates: Partial<Containe>)`
- `removeContainer(id: strig)`
- `nestContainer(childId: string, parentId: strig)`
- `getContainerById(id: string): Container | undefied`

**State Structure*:


```typescript
type Container = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  styles: {
    backgroundColor: string;
    border: string;
    zIndex: number;
    // ...other style properties
  };
  parentId: string | null;
  children: string[];
};

type CanvasState = {
  containers: Record<string, Container>;
  // ...functions listed above
};
``


### 2. `uiStore.ts`

**Purpose*: Handles UI-related state such as the currently selected container ID and .

**Functions**:
- `selectContainer(id: strig)`
- `togglePropertyPanel(visible: boolen)`

**State Structure*:


```typescript
type UIState = {
  selectedContainerId: string | null;
  isPropertyPanelVisible: boolean;
  // ...functions listed above
};
``


### 3. `codeGenStore.ts` *(Optional)*

**Purpose*: Stores the generated HTML/CSS code preview state and staus.

**Functions**:
- `generateCod()`
- `setCodeStatus(status: 'idle' | 'generating' | 'success' | 'erro')`

**State Structure*:


```typescript
type CodeGenState = {
  generatedCode: string;
  codeStatus: 'idle' | 'generating' | 'success' | 'error';
  // ...functions listed above
};
``


## 🧩 UI Components

- **Canvas**: Main area where containers are rendered and can be interacted ith.
- **Container**: Individual draggable and resizable elements placed on the cavas.
- **Sidebar**: Displays a hierarchical tree of containers for easy navigation and nesing.
- **Property Panel**: Allows users to edit properties of the selected contaner.
- **Toolbar**: Provides tools for adding containers, generating code, and other actons.
- **Modal**: Displays generated code for preview and copy functionaity.

## 🔄 Data Flow Overview

1. **User Interacting**: User performs actions like adding, moving, or resizing contaners.
2. **State Update**: Corresponding functions in `canvasStore.ts` and `uiStore.ts` are invoked to update the tate.
3. **UI Reflects Stae**: Components subscribed to the stores re-render to reflect the updated tate.
4. **Code Generating**: Upon request, `codeGenStore.ts` generates the HTML/CSS code based on the current tate.

## 🔗 External Resources

- **dnd-kit Documentaton**: [https://dndkit.com/](https://dndki.com/)
- **react-moveable Gitub**: [https://github.com/daybrush/moveable](https://github.com/daybrush/moeable)
- **Zustand Documentaton**: [https://github.com/pmndrs/zustand](https://github.com/pmndrs/zstand)
- **Immer Documentaton**: [https://immerjs.github.io/immer/](https://immerjs.github.io/mmer/)
- **nanoid Documentaton**: [https://github.com/ai/nanoid](https://github.com/ai/anoid)
