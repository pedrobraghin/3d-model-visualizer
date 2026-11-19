import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import { ModelViewer } from './model-viewer';

interface Props {
  path: string;
}

export function ModelThumbnail({ path }: Readonly<Props>) {
  return (
    <div className="h-32 w-full overflow-hidden rounded-lg bg-neutral-100">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        camera={{ position: [0, 0.5, 4], fov: 40 }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 4, 5]} intensity={2} />

        <Suspense fallback={null}>
          <ModelViewer
            path={path}
            animated={false}
            texturesByArea={{}}
            textureTransforms={{}}
            colorsByArea={{}}
            position={[0, -1, 0]}
            rotation={[0, 0, 0]}
            scale={1.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
