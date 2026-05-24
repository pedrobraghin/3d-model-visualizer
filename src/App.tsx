import { useCallback, useState } from 'react';
import { ModelViewer, Scene, Sidebar } from './components';
import models from './data/models.json';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

function App() {
  const [selectedModel, setSelectedModel] = useState(models[0]);

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
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          texturesByArea={texturesByArea}
          handleUpload={handleUpload}
        />

        <main className="flex-1 ">
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

            <ModelViewer
              model={selectedModel}
              texturesByArea={texturesByArea}
            />
          </Canvas>
        </main>
      </div>
    </div>
  );
}

export default App;
