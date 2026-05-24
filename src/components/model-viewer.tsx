import type { Model } from '../@types';
import { GLBModel } from './glb-model';

interface Props {
  model: Model;
  texturesByArea: Record<string, string>;
}

export function ModelViewer({ model, texturesByArea }: Readonly<Props>) {
  return (
    <group>
      <GLBModel modelUrl={model.path} texturesByArea={texturesByArea} />
    </group>
  );
}
