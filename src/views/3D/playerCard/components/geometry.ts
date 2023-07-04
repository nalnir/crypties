    
    import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
  
// CARD
  const roundedRectShape = new THREE.Shape();
  const x = -1.25;
  const y = 0.9;
  const width = 2.5;
  const height = 1.8;
  const radius = 0.025;

  roundedRectShape.moveTo(x + radius, y);
  roundedRectShape.lineTo(x + width - radius, y);
  roundedRectShape.quadraticCurveTo(x + width, y, x + width, y + radius);
  roundedRectShape.lineTo(x + width, y + height - radius);
  roundedRectShape.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height
  );
  roundedRectShape.lineTo(x + radius, y + height);
  roundedRectShape.quadraticCurveTo(x, y + height, x, y + height - radius);
  roundedRectShape.lineTo(x, y + radius);
  roundedRectShape.quadraticCurveTo(x, y, x + radius, y);

  const extrudeSettings = {
    steps: 1,
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelOffset: 0,
    bevelSegments: 2,
  };

  const cardWidth = 3;
  const cardHeight = 4;
  const cardDepth = 0.1;

  export const shapeGeometry = new THREE.ExtrudeGeometry(roundedRectShape, extrudeSettings);

  const cardBodyradius = 50; // Adjust the corner radius as needed
  export const cardBodygeometry = new RoundedBoxGeometry(cardWidth, cardHeight, cardDepth, cardBodyradius);
  
  // HEALTH COMPONENT
  export const healthComponentShape = new THREE.Shape();

  // ATTACK POWER
  export const attackPowerComponentShape = new THREE.IcosahedronGeometry(1, 1)