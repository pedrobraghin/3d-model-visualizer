import type { Model, TextureTransforms } from '../@types';
import { GLBModel } from './glb-model';

interface Props {
  model: Model;
  texturesByArea: Record<string, string>;
  textureTransforms: TextureTransforms;
  position?: number[];
  rotation?: number[];
  scale?: number;
}

export function ModelViewer({
  model,
  texturesByArea,
  textureTransforms,
  position,
  rotation,
  scale,
}: Readonly<Props>) {
  return (
    <group>
      <GLBModel
        modelUrl={model.path}
        texturesByArea={texturesByArea}
        textureTransforms={textureTransforms}
        animated={model.animated}
        position={position}
        rotation={rotation}
        scale={scale}
      />
    </group>
  );
}
