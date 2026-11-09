import { Bounds, useGLTF } from '@react-three/drei';
import { useMemo, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import type { TextureTransforms } from '../@types';

interface Props {
  modelUrl: string;
  texturesByArea: Record<string, string>;
  textureTransforms: TextureTransforms;
  animated?: boolean;
  position?: number[];
  rotation?: number[];
  scale?: number;
}

export function GLBModel({
  modelUrl,
  texturesByArea,
  textureTransforms,
  position = [0, -1, 0],
  rotation = [0, 0, 0],
  scale = 1.5,
  animated = false,
}: Readonly<Props>) {
  const { scene } = useGLTF(modelUrl);

  /*
    Referência da tampa
  */
  const topRef = useRef<THREE.Object3D | null>(null);

  /*
    Carrega texturas
  */
  const textures = useMemo(() => {
    const loadedTextures: Record<string, THREE.Texture> = {};

    Object.entries(texturesByArea).forEach(([area, imageUrl]) => {
      if (!imageUrl) return;

      const texture = new THREE.TextureLoader().load(imageUrl);

      texture.flipY = false;
      texture.colorSpace = THREE.SRGBColorSpace;

      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;

      loadedTextures[area] = texture;
    });

    return loadedTextures;
  }, [texturesByArea]);

  /*
    Configura materiais
  */
  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.name === 'TOP') {
        topRef.current = obj;
      }

      if (!(obj instanceof THREE.Mesh)) return;

      obj.castShadow = true;
      obj.receiveShadow = true;

      const originalMaterials = Array.isArray(obj.material)
        ? obj.material
        : [obj.material];

      const updatedMaterials = originalMaterials.map((material) => {
        const texture = textures[material.name] ?? textures[obj.name];

        if (!texture) return material;

        const cloned = material.clone();
        cloned.map = texture;
        cloned.needsUpdate = true;

        return cloned;
      });

      obj.material = Array.isArray(obj.material)
        ? updatedMaterials
        : updatedMaterials[0];
    });
  }, [scene, textures]);

  /*
    Animação suave da tampa
  */
  useFrame(() => {
    if (!topRef.current) return;

    const targetRotation = animated ? -Math.PI / 1.8 : 0;

    topRef.current.rotation.x = THREE.MathUtils.lerp(
      topRef.current.rotation.x,
      targetRotation,
      0.08,
    );
  });

  useEffect(() => {
    Object.entries(textures).forEach(([area, texture]) => {
      const transform = textureTransforms[area] ?? {
        rotation: 0,
        offsetX: 0,
        offsetY: 0,
        zoom: 1,
      };

      texture.center.set(0.5, 0.5);

      texture.rotation = THREE.MathUtils.degToRad(transform.rotation);

      texture.offset.set(transform.offsetX, transform.offsetY);

      texture.repeat.set(transform.zoom, transform.zoom);
    });
  }, [textures, textureTransforms]);

  return (
    <Bounds fit clip observe margin={2}>
      <primitive
        object={scene}
        scale={scale}
        position={position}
        rotation={rotation}
      />
    </Bounds>
  );
}
