# 📋 Exacto 2.0 Implementation Blueprint

## 🚀 Project Setup

- [x] Initialize Next.js project with TypeScript
- [x] Configure Tailwind CSS
- [x] Set up Shadcn UI components
- [x] Install required dependencies (dnd-kit, react-moveable, nanoid, zustand, immer, clsx)
- [x] Create basic folder structure (components, stores, hooks, utils)

## 💾 Store Implementation

- [x] Create `canvasStore.ts` with container management logic
  - [x] Define Container type interface
  - [x] Implement container CRUD operations (add, update, remove)
  - [x] Implement nesting/hierarchy functionality
  - [x] Add container query methods

- [x] Create `uiStore.ts` for UI state management
  - [x] Implement container selection logic
  - [x] Add property panel visibility toggle

- [x] Create `codeGenStore.ts` for code generation
  - [x] Implement code generation functions
  - [x] Add code status management

## 🧩 Component Implementation

- [ ] Create Canvas component
  - [ ] Implement responsive device presets (mobile, tablet, laptop, desktop)
  - [ ] Add container rendering logic
  - [ ] Set up drag and drop functionality using dnd-kit

- [ ] Create Container component
  - [ ] Implement draggable functionality
  - [ ] Add resizable functionality using react-moveable
  - [ ] Handle selection interactions
  - [ ] Support nested containers rendering

- [ ] Create Sidebar component
  - [ ] Implement hierarchical tree view of containers
  - [ ] Add drag and drop for container nesting
  - [ ] Handle container selection via sidebar

- [x] Create Property Panel component
  - [x] Design input controls for container properties
  - [x] Implement property update handlers
  - [x] Add background color picker
  - [x] Add border style controls
  - [x] Add dimension controls (width, height)
  - [x] Add z-index controls

- [x] Create Toolbar component
  - [x] Add device dropdown for canvas presets
  - [x] Implement container creation button
  - [x] Add code generation button
  - [x] Implement z-index controls

- [ ] Create Modal component for code preview
  - [ ] Design code display layout
  - [ ] Add syntax highlighting
  - [ ] Implement copy functionality

## 🔄 Interaction Features

- [ ] Implement drag and drop for containers
  - [ ] Handle position updates
  - [ ] Support keyboard controls for fine adjustments
  - [ ] Add free placement without snapping

- [ ] Implement container resizing
  - [ ] Handle dimension updates
  - [ ] Add keyboard controls for precise resizing

- [ ] Implement container nesting logic
  - [ ] Update positioning when nesting (parent to relative, child to absolute)
  - [ ] Handle z-index management in nested containers

## 🔍 Code Generation

- [ ] Implement code generation algorithm
  - [ ] Handle traversal of container hierarchy
  - [ ] Generate HTML with inline CSS
  - [ ] Format output code
  - [ ] Handle nested container relationships in generated code

- [ ] Create code preview functionality
  - [ ] Display generated code in modal
  - [ ] Add copy to clipboard feature
