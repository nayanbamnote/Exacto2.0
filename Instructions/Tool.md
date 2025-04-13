# Code Generator Tool Specification

## Overview
The Code Generator Tool is a visual playground for designing UI layouts using HTML and CSS with absolute and relative positioning. Users can create, position, nest, and style container elements on a canvas that simulates various device screen sizes (mobile, tablet, laptop, desktop, etc.). Once satisfied, users can generate a code snippet that includes HTML with embedded CSS reflecting the designed layout.

## Features

### 1. Canvas with Device Presets
- **Device Dropdown:**  
  A dropdown menu provides a list of predetermined screen sizes (e.g., mobile, tablet, laptop, desktop) representing common device dimensions.
- **Responsive Canvas:**  
  When a device is selected, the canvas adjusts to that device’s screen dimensions, allowing users to design layouts targeted at specific devices.

### 2. Container Management

#### Draggable & Resizable Containers
- **Mouse-Driven Interactions:**  
  Containers can be dragged and resized using the mouse.
- **Keyboard Controls:**  
  Optional keyboard controls let users move the selected container by 1px, 5px, or 10px increments for finer adjustments.
- **Free Placement:**  
  No snapping or grid alignment restrictions enable complete freedom in positioning elements.

#### Nested Containers
- **Default Positioning:**  
  When a new container is added, it is by default set with absolute positioning relative to the canvas.
- **Hierarchy Management:**  
  A sidebar displays a hierarchical tree (similar to VS Code’s file explorer) where containers can be dragged and dropped to create parent-child relationships.
- **Automatic Position Adjustment:**  
  When an element is nested:
  - The parent container’s position is updated to relative.
  - The child container remains absolute so that its position is calculated according to the parent container.
- **Z-Index Control:**  
  The top toolbar displays and allows users to modify the z-index of the selected container to manage overlapping elements.

### 3. Code Generation
- **Output Structure:**  
  The tool generates a single HTML file containing internal CSS.
- **Formatting:**  
  The generated code uses basic HTML and CSS without advanced features like Flexbox or Grid.
- **Properties Included:**  
  Only essential attributes like width, height, background color, border color, and z-index are included in the generated code.
- **Sample Code Snippet:**  

    ```html
    <div class="canvas" style="position: relative; width: 1024px; height: 768px;">
      <div class="container" style="position: absolute; left: 100px; top: 150px; width: 200px; height: 100px; background: #f00; border: 1px solid #000; z-index: 10;">
        <!-- Nested elements would be included here -->
      </div>
    </div>
    ```

### 4. User Interface & Customization Options

#### Layout & Toolbar
- **Top Bar:**
  - Device dropdown for switching canvas dimensions.
  - Display of selected container’s z-index, with controls to update this value.
- **Sidebar:**
  - A hierarchical tree view lists all containers for easy management and nested relationships.
  - Drag-and-drop functionality allows users to nest containers intuitively.
  
#### Properties Panel
- **Editable Attributes:**  
  When a container is selected, a properties panel appears. This panel lets users customize:
  - Background color
  - Border properties (color, width)
  - Dimensions (width, height)
  - Z-index (to manage stacking order)
- **Direct Manipulation:**  
  In addition to mouse interactions for dragging/resizing, users can make fine adjustments via keyboard inputs.

### 5. Implementation & Technical Considerations

#### Frameworks & Libraries
- **Technology Stack:**  
  Built with Next.js and TypeScript for a robust, modern web application.
- **Styling:**  
  Tailwind CSS is used for rapid UI development and consistent design.
- **UI Components:**  
  Shadcn can be integrated for component design, ensuring a polished look and feel.
- **Interaction Libraries:**  
  For drag-and-drop and resize functionalities, consider libraries such as:
  - [react-draggable](https://www.npmjs.com/package/react-draggable)
  - [react-resizable](https://www.npmjs.com/package/react-resizable)
  - Alternatively, libraries like interact.js offer additional flexibility if needed.

#### Code Generation Logic
- **Component Tree Iteration:**  
  The generator traverses the container hierarchy to produce HTML with internal CSS.
- **Nested Positioning:**  
  Ensure the generated code preserves the relative and absolute positioning, especially for nested containers (i.e., parent containers get `position: relative` and children get `position: absolute`).
- **Customization Management:**  
  Extract styling properties (dimensions, background, border, z-index) from the properties panel to embed inline in the HTML.

#### Future Enhancements
- **Enhance Keyboard Controls:**  
  Extend movement controls to allow customizable increment values.
- **Extended Styling:**  
  Although basic styling is sufficient for now, additional properties (like margins, padding) could be added later.
- **Advanced Export Options:**  
  Consider exporting as separate HTML and CSS files or even integrating into a simple templating system if needed.

## User Workflow
1. **Canvas Setup:**  
   The user loads the application and selects a device preset from the dropdown, adjusting the canvas to the corresponding screen size.
2. **Adding Containers:**  
   By clicking the container icon in the top bar, a new container with default dimensions appears on the canvas.
3. **Customization and Positioning:**  
   The user selects a container:
   - Drag and resize it freely on the canvas.
   - Use keyboard controls for fine adjustments.
   - Modify properties (background color, border, width, height, z-index) via the properties panel.
4. **Nesting Containers:**  
   The user drags one container onto another in the sidebar to create a nested structure. The tool sets the parent’s position to relative and the child’s to absolute.
5. **Code Generation:**  
   Once layout and styling are finalized, the user clicks the "Generate" button. The tool outputs a complete HTML snippet with internal CSS that reflects the designed layout.

## Conclusion
This Code Generator Tool offers a straightforward, visual method for creating responsive UI layouts using fundamental HTML and CSS positioning techniques. By combining drag-and-drop, direct property editing, and a clear hierarchy view, it simplifies the process of converting a visual design into working code. The tool’s architecture is designed with extensibility in mind, ensuring that it can evolve with user needs and additional functionality over time.

---