import { useState } from 'react';
import type {
  Model,
  Preset,
  TextureTransform,
  TextureTransforms,
} from '../@types';

import presets from '../data/presets.json';

import { ModelArea } from './model-area';
import { PresetCard } from './preset-card';

interface Props {
  selectedPreset: Preset;
  setSelectedPreset: (preset: Preset) => void;
  texturesByArea: Record<string, string>;
  handleUpload: (area: string, file?: File) => void;
  textureTransforms: TextureTransforms;
  updateTextureTransform: (
    area: string,
    changes: Partial<TextureTransform>,
  ) => void;
  resetTextureTransform: (area: string) => void;
  isHidden?: boolean;
  colorsByArea: Record<string, string>;
  handleColorChange: (area: string, color: string) => void;
  selectedModels: {
    model: Model;
    position: number[];
    rotation: number[];
    scale: number;
  }[];
}

export function Sidebar({
  isHidden = false,
  selectedPreset,
  setSelectedPreset,
  texturesByArea,
  handleUpload,
  textureTransforms,
  updateTextureTransform,
  resetTextureTransform,
  selectedModels,
  colorsByArea,
  handleColorChange,
}: Readonly<Props>) {
  const areas = [
    ...new Set(selectedModels.flatMap((item) => item.model.areas)),
  ];

  const [selectedArea, setSelectedArea] = useState('');

  if (isHidden) return null;

  const activeArea = areas.includes(selectedArea)
    ? selectedArea
    : (areas[0] ?? '');

  const transform = textureTransforms[activeArea] ?? {
    rotation: 0,
    offsetX: 0,
    offsetY: 0,
    zoom: 1,
  };

  const hasImage = Boolean(texturesByArea[activeArea]);

  const update = (changes: Partial<TextureTransform>) => {
    updateTextureTransform(activeArea, changes);
  };

  return (
    <aside className="w-80 shrink-0 py-5 px-5 flex flex-col gap-6 overflow-auto">
      {/* PRESETS */}
      <section>
        <h2 className="font-semibold mb-3">Presets</h2>

        <div className="flex flex-col gap-4 pb-4">
          {presets.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              isActive={preset.id === selectedPreset.id}
              onSelect={setSelectedPreset}
            />
          ))}
        </div>
      </section>

      {/* ÁREAS */}
      <section>
        <h2 className="font-semibold mb-3">Áreas personalizáveis</h2>

        <div className="flex flex-col gap-4 p-4 border-b border-black/65">
          {areas.map((area) => (
            <ModelArea
              key={area}
              area={area}
              preview={texturesByArea[area]}
              handleUpload={handleUpload}
              color={colorsByArea[area] ?? '#ffffff'}
              handleColorChange={handleColorChange}
            />
          ))}
        </div>
      </section>

      {/* AJUSTAR ARTE */}
      <section className="flex flex-col gap-4">
        <h2 className="font-semibold">Ajustar arte</h2>

        <div className="flex flex-col gap-1">
          <label htmlFor="texture-area" className="text-sm">
            Área de impressão
          </label>

          <select
            id="texture-area"
            value={activeArea}
            onChange={(event) => setSelectedArea(event.target.value)}
            className="w-full rounded-md border border-neutral-300 bg-white p-2 text-sm text-black"
          >
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {!hasImage ? (
          <p className="text-sm text-neutral-500">
            Envie uma imagem para esta área antes de ajustar a arte.
          </p>
        ) : (
          <>
            {/* ROTAÇÃO */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <label htmlFor="texture-rotation">Rotação</label>
                <span>{transform.rotation}°</span>
              </div>

              <input
                id="texture-rotation"
                type="range"
                min={-180}
                max={180}
                step={1}
                value={transform.rotation}
                onChange={(event) =>
                  update({ rotation: Number(event.target.value) })
                }
                className="w-full"
              />
            </div>

            {/* POSIÇÃO X */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <label htmlFor="texture-x">Posição horizontal</label>
                <span>{Math.round(transform.offsetX * 100)}%</span>
              </div>

              <input
                id="texture-x"
                type="range"
                min={-0.5}
                max={0.5}
                step={0.01}
                value={transform.offsetX}
                onChange={(event) =>
                  update({ offsetX: Number(event.target.value) })
                }
                className="w-full"
              />
            </div>

            {/* POSIÇÃO Y */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <label htmlFor="texture-y">Posição vertical</label>
                <span>{Math.round(transform.offsetY * 100)}%</span>
              </div>

              <input
                id="texture-y"
                type="range"
                min={-0.5}
                max={0.5}
                step={0.01}
                value={transform.offsetY}
                onChange={(event) =>
                  update({ offsetY: Number(event.target.value) })
                }
                className="w-full"
              />
            </div>

            {/* ESCALA */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <label htmlFor="texture-zoom">Escala da arte</label>
                <span>{Math.round(transform.zoom * 100)}%</span>
              </div>

              <input
                id="texture-zoom"
                type="range"
                min={0.5}
                max={2}
                step={0.01}
                value={transform.zoom}
                onChange={(event) =>
                  update({ zoom: Number(event.target.value) })
                }
                className="w-full"
              />
            </div>

            <button
              type="button"
              onClick={() => resetTextureTransform(activeArea)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100"
            >
              Redefinir ajustes
            </button>
          </>
        )}
      </section>

      {/* AJUDA */}
      <section className="text-sm leading-relaxed space-y-2 pt-4 border-t border-neutral-800">
        <p>• Arraste para rotacionar o modelo</p>
        <p>• Scroll para zoom da câmera</p>
        <p>• Botão direito move a câmera</p>
      </section>
    </aside>
  );
}
