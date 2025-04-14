// Handle selecting nested elements
export const handleNestedSelection = (selected: Array<HTMLElement | SVGElement>) => {
  // Option 1: Keep only top-level elements (current behavior)
  return selected.filter(target => 
    selected.every(target2 => target === target2 || !target2.contains(target))
  );
}; 