import { Container } from '../stores/canvasStore';

/**
 * Dummy data for testing canvas rendering
 */
export const dummyContainers: Record<string, Container> = {
  'container1': {
    id: 'container1',
    x: 100,
    y: 50,
    width: 300,
    height: 200,
    styles: {
      backgroundColor: '#f0f8ff',
      border: '2px solid #4682b4',
      zIndex: 1,
    },
    parentId: null,
    children: ['container3', 'container4'],
  },
  'container2': {
    id: 'container2',
    x: 450,
    y: 50,
    width: 250,
    height: 180,
    styles: {
      backgroundColor: '#e6e6fa',
      border: '2px solid #9370db',
      zIndex: 1,
    },
    parentId: null,
    children: [],
  },
  'container3': {
    id: 'container3',
    x: 120,
    y: 80,
    width: 120,
    height: 80,
    styles: {
      backgroundColor: '#e0ffff',
      border: '1px solid #5f9ea0',
      zIndex: 2,
    },
    parentId: 'container1',
    children: [],
  },
  'container4': {
    id: 'container4',
    x: 250,
    y: 80,
    width: 130,
    height: 90,
    styles: {
      backgroundColor: '#fff0f5',
      border: '1px solid #db7093',
      zIndex: 2,
    },
    parentId: 'container1',
    children: [],
  },
  'container5': {
    id: 'container5',
    x: 250,
    y: 300,
    width: 350,
    height: 220,
    styles: {
      backgroundColor: '#f5f5dc',
      border: '2px dashed #8b4513',
      zIndex: 1,
    },
    parentId: null,
    children: ['container6'],
  },
  'container6': {
    id: 'container6',
    x: 280,
    y: 330,
    width: 150,
    height: 100,
    styles: {
      backgroundColor: '#fffacd',
      border: '1px solid #daa520',
      zIndex: 2,
    },
    parentId: 'container5',
    children: [],
  },
};