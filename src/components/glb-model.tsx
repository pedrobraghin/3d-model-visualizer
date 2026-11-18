import { Bounds, useGLTF } from '@react-three/drei';
import { useMemo, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import type { TextureTransforms } from '../@types';

interface Props {
  modelUrl: string;
  texturesByArea: Record<string, string>;
  colorsByArea: Record<string, string>;
  textureTransforms: TextureTransforms;
  animated?: boolean;
  position?: number[];
  rotation?: number[];
  scale?: number;
}

const DEFAULT_TRANSFORM = {
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
  zoom: 1,
};

export function GLBModel({
  modelUrl,
  texturesByArea,
  colorsByArea,
  textureTransforms,
  position = [0, -1, 0],
  rotation = [0, 0, 0],
  scale = 1.5,
  animated = false,
}: Readonly<Props>) {
  const { scene: originalScene } = useGLTF(modelUrl);

  const topRef = useRef<THREE.Object3D | null>(null);

  /*
   * Cria uma cópia independente da cena e dos materiais.
   * Assim, as personalizações não alteram o GLB em cache.
   */
  const scene = useMemo(() => {
    const clonedScene = originalScene.clone(true);

    clonedScene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;

      const cloneMaterial = (material: THREE.Material) => {
        const cloned = material.clone();

        if ('color' in cloned && cloned.color instanceof THREE.Color) {
          cloned.userData.baseColor = cloned.color.clone();
        }

        if ('map' in cloned) {
          cloned.userData.baseMap = cloned.map;
        }

        return cloned;
      };

      obj.material = Array.isArray(obj.material)
        ? obj.material.map(cloneMaterial)
        : cloneMaterial(obj.material);
    });

    return clonedScene;
  }, [originalScene]);

  /*
   * Carrega as texturas enviadas pelo usuário.
   */
  const textures = useMemo(() => {
    const loaded: Record<string, THREE.Texture> = {};

    Object.entries(texturesByArea).forEach(([area, imageUrl]) => {
      if (!imageUrl) return;

      const texture = new THREE.TextureLoader().load(imageUrl);

      texture.flipY = false;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.premultiplyAlpha = false;

      loaded[area] = texture;
    });

    return loaded;
  }, [texturesByArea]);

  /*
   * Aplica textura ou cor conforme a área.
   * O nome do material tem prioridade sobre o nome da malha.
   */
  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.name === 'TOP') {
        topRef.current = obj;
      }

      if (!(obj instanceof THREE.Mesh)) return;

      obj.castShadow = true;
      obj.receiveShadow = true;

      const materials = Array.isArray(obj.material)
        ? obj.material
        : [obj.material];

      materials.forEach((material) => {
        const area =
          textures[material.name] || colorsByArea[material.name]
            ? material.name
            : obj.name;

        const texture = textures[area];
        const color = colorsByArea[area];

        if ('map' in material) {
          material.map = texture ?? material.userData.baseMap ?? null;
        }

        if ('color' in material && material.color instanceof THREE.Color) {
          if (texture) {
            // A textura PNG mantém sua transparência.
            // O branco evita tingir as cores visíveis da arte.
            material.color.set('#ffffff');

            // Habilita a transparência do PNG.
            material.transparent = true;
            material.alphaTest = 0.01;
          } else {
            material.transparent = false;
            material.alphaTest = 0;

            if (color) {
              material.color.set(color);
            } else if (material.userData.baseColor) {
              material.color.copy(material.userData.baseColor);
            }
          }
        }

        material.needsUpdate = true;
      });
    });
  }, [scene, textures, colorsByArea]);

  /*
   * Ajusta posição, escala e rotação das texturas.
   */
  useEffect(() => {
    Object.entries(textures).forEach(([area, texture]) => {
      const transform = textureTransforms[area] ?? DEFAULT_TRANSFORM;

      texture.center.set(0.5, 0.5);
      texture.rotation = THREE.MathUtils.degToRad(transform.rotation);
      texture.offset.set(transform.offsetX, transform.offsetY);
      texture.repeat.set(transform.zoom, transform.zoom);
      texture.needsUpdate = true;
    });
  }, [textures, textureTransforms]);

  /*
   * Animação da tampa.
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
