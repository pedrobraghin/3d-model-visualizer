import { Bounds, Center, useGLTF } from '@react-three/drei';
import { useMemo, useEffect } from 'react';
import * as THREE from 'three';

interface Props {
  modelUrl: string;
  texturesByArea: Record<string, string>;
  open?: boolean;
}

export function GLBModel({ modelUrl, texturesByArea }: Readonly<Props>) {
  const { scene } = useGLTF(modelUrl);

  /*
    Carrega todas as texturas
    baseado nas áreas
  */
  const textures = useMemo(() => {
    const loadedTextures: Record<string, THREE.Texture> = {};

    Object.entries(texturesByArea).forEach(([area, imageUrl]) => {
      if (!imageUrl) return;

      const texture = new THREE.TextureLoader().load(imageUrl);

      texture.flipY = false;

      texture.colorSpace = THREE.SRGBColorSpace;

      loadedTextures[area] = texture;
    });

    return loadedTextures;
  }, [texturesByArea]);

  useEffect(() => {
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;

      obj.castShadow = true;
      obj.receiveShadow = true;

      /*
        Procura textura baseada
        no nome do mesh
      */
      const texture = textures[obj.name];

      if (!texture) return;

      if (Array.isArray(obj.material)) {
        obj.material = obj.material.map((mat) => {
          const cloned = mat.clone();

          cloned.map = texture;

          cloned.needsUpdate = true;

          return cloned;
        });
      } else {
        obj.material = obj.material.clone();

        obj.material.map = texture;

        obj.material.needsUpdate = true;
      }
    });
  }, [scene, textures]);

  return (
    <Bounds fit clip observe margin={2}>
      <Center>
        <primitive object={scene} scale={1.5} position={[0, -1, 0]} />
      </Center>
    </Bounds>
  );
}
