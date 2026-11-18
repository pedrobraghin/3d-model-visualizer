import { useCallback, useState } from 'react';
import { ModelViewer, Scene, Sidebar } from './components';

import presets from './data/presets.json';
import models from './data/models.json';

import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import type { TextureTransform, TextureTransforms } from './@types';

function App() {
  const [textureTransforms, setTextureTransforms] = useState<TextureTransforms>(
    {},
  );

  const [colorsByArea, setColorsByArea] = useState<Record<string, string>>({});

  const handleColorChange = useCallback((area: string, color: string) => {
    setColorsByArea((prev) => ({
      ...prev,
      [area]: color,
    }));
  }, []);

  const [uiHidden, setUiHidden] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(presets[0]);
  const selectedModels = selectedPreset.referenceModels
    .map((reference) => {
      const model = models.find((m) => m.id === reference.modelId)!;

      return {
        ...reference,
        model,
      };
    })
    .filter(Boolean);

  const [texturesByArea, setTexturesByArea] = useState<Record<string, string>>(
    {},
  );

  /*
    Upload por área
  */
  const handleUpload = useCallback((area: string, file?: File) => {
    if (!file) {
      setTexturesByArea((prev) => ({
        ...prev,
        [area]: '',
      }));

      return;
    }

    const url = URL.createObjectURL(file);

    setTexturesByArea((prev) => ({
      ...prev,
      [area]: url,
    }));
  }, []);

  const updateTextureTransform = useCallback(
    (area: string, changes: Partial<TextureTransform>) => {
      setTextureTransforms((prev) => ({
        ...prev,
        [area]: {
          ...prev[area],
          ...changes,
        },
      }));
    },
    [],
  );

  const resetTextureTransform = useCallback((area: string) => {
    setTextureTransforms((prev) => ({
      ...prev,
      [area]: {
        rotation: 0,
        offsetX: 0,
        offsetY: 0,
        zoom: 1,
      },
    }));
  }, []);

  return (
    <div className="w-screen h-screen bg-[#f0f0f0]">
      <header className="px-5 w-full py-3 bg-black/95 text-white">
        <h1 className="text-2xl font-bold mb-1 h-10">Mockup Viewer</h1>

        <span className="text-sm text-neutral-200 leading-relaxed">
          Visualizador 3D para aplicação de artes em modelos GLB.
        </span>
      </header>
      <div className="flex gap-10 h-[calc(100vh-94px)]">
        <Sidebar
          selectedPreset={selectedPreset}
          setSelectedPreset={setSelectedPreset}
          texturesByArea={texturesByArea}
          handleUpload={handleUpload}
          selectedModels={selectedModels}
          textureTransforms={textureTransforms}
          updateTextureTransform={updateTextureTransform}
          resetTextureTransform={resetTextureTransform}
          colorsByArea={colorsByArea}
          handleColorChange={handleColorChange}
          isHidden={uiHidden}
        />

        <div className="fixed top-3 right-3 z-10">
          <button
            onClick={() => setUiHidden(!uiHidden)}
            className="bg-black/95 text-white px-4 py-2 rounded-md hover:bg-black/80 transition-colors"
          >
            {uiHidden ? 'Show UI' : 'Hide UI'}
          </button>
        </div>

        <main className="flex-1 min-w-0">
          <Canvas
            shadows
            gl={{
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 0.8,
              outputColorSpace: THREE.SRGBColorSpace,
            }}
            camera={{
              position: [0, 1, 4],
              fov: 45,
            }}
          >
            <Scene />

            {selectedModels.map((item, index) => (
              <ModelViewer
                key={`${item.model.id}-${index}`}
                model={item.model}
                texturesByArea={texturesByArea}
                textureTransforms={textureTransforms}
                colorsByArea={colorsByArea}
                position={item.position}
                rotation={item.rotation}
                scale={item.scale}
              />
            ))}
          </Canvas>
        </main>
      </div>
    </div>
  );
}

export default App;
