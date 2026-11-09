import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

export function Scene() {
  return (
    <>
      <color attach="background" args={['#000']} />

      <ambientLight intensity={1} />

      <directionalLight position={[5, 8, 5]} intensity={0.2} castShadow />

      <directionalLight position={[-3, 2, -2]} intensity={0.15} castShadow />

      <Environment preset="studio" environmentIntensity={0.3} />

      <ContactShadows
        position={[3, -1.5, 0]}
        opacity={0.45}
        scale={10}
        blur={2.5}
        far={5}
      />

      <OrbitControls
        enableDamping
        dampingFactor={0.2}
        autoRotate
        autoRotateSpeed={1}
        target={[0, -1, 0]}
      />

      <EffectComposer>
        {/* brilho suave */}
        <Bloom intensity={0.08} luminanceThreshold={1} />

        {/* bordas escuras suaves */}
        <Vignette eskil={false} offset={0.1} darkness={0.4} />
      </EffectComposer>
    </>
  );
}
