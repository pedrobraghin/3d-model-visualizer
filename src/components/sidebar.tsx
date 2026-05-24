import type { Model } from '../@types';
import models from '../data/models.json';
import { ModelArea } from './model-area';
import { ModelCard } from './model-card';

interface Props {
  selectedModel: Model;

  setSelectedModel: (model: Model) => void;

  texturesByArea: Record<string, string>;

  handleUpload: (area: string, file?: File) => void;
}

export function Sidebar({
  selectedModel,
  setSelectedModel,
  texturesByArea,
  handleUpload,
}: Readonly<Props>) {
  return (
    <div className="w-80 py-5 flex flex-col gap-6 overflow-auto px-5">
      {/* MODELOS */}
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold mb-3">Modelos</h2>

        <div className="flex flex-col gap-4 overflow-autopb-4 scrollbar-none flex-2/3">
          {models.map((model) => {
            const active = model.id === selectedModel.id;

            return (
              <ModelCard
                key={model.id}
                model={model}
                isActive={active}
                onSelect={setSelectedModel}
              />
            );
          })}
        </div>
      </div>

      {/* ÁREAS */}
      <div className="fixed right-10 top-0 z-10">
        <h2 className="font-semibold mb-3">Áreas personalizáveis</h2>

        <div className="flex flex-col gap-4 overflow-auto max-h-200 w-64 p-4 scrollbar-none border-b border-black/65">
          {selectedModel.areas.map((area) => {
            const preview = texturesByArea[area];

            return (
              <ModelArea
                key={area}
                area={area}
                preview={preview}
                handleUpload={handleUpload}
              />
            );
          })}
        </div>
      </div>

      {/* AJUDA */}
      <div className="flex-1/3 text-sm leading-relaxed space-y-2 pt-4 border-t border-neutral-800 ">
        <p>• Arraste para rotacionar</p>
        <p>• Scroll para zoom</p>
        <p>• Botão direito move câmera</p>
      </div>
    </div>
  );
}
