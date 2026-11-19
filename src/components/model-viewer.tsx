import type { TextureTransforms } from '../@types';
import { GLBModel } from './glb-model';

interface Props {
  texturesByArea: Record<string, string>;
  textureTransforms: TextureTransforms;
  position?: number[];
  rotation?: number[];
  scale?: number;
  colorsByArea?: Record<string, string>;
  path: string;
  animated?: boolean;
}

export function ModelViewer({
  path,
  animated = false,
  texturesByArea,
  textureTransforms,
  position,
  rotation,
  scale,
  colorsByArea = {},
}: Readonly<Props>) {
  return (
    <group>
      <GLBModel
        colorsByArea={colorsByArea}
        modelUrl={path}
        texturesByArea={texturesByArea}
        textureTransforms={textureTransforms}
        animated={animated}
        position={position}
        rotation={rotation}
        scale={scale}
      />
    </group>
  );
}
