import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { useGLTF, Environment } from "@react-three/drei";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";

// ==============================================
// Constants
export const COUNT = 100;
export const ANIMATION_SPEED = 0.02;
export const DEPTH_OF_FIELD = 80;

// ==============================================

function Banana({ z }) {
  const ref = useRef();
  const { viewport, camera } = useThree();
  const { scene } = useGLTF("/banana-v1.glb");
  const { nodes, materials } = useGLTF("/banana-v1.glb");

  // gets the width and height of the viewport
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, z]);

  const [data] = useState({
    x: THREE.MathUtils.randFloatSpread(2),
    y: THREE.MathUtils.randFloatSpread(height),
    rx: Math.random() * Math.PI,
    ry: Math.random() * Math.PI,
    rz: Math.random() * Math.PI,
  });

  useFrame((state) => {
    // Rotrate the Banana on the x, y, and z axis with (+= 0.01) bwing mutatiuon
    ref.current.rotation.set(
      (data.rx += 0.01),
      (data.ry += 0.01),
      (data.rz += 0.01)
    );
    ref.current.position.set(data.x * width, (data.y += ANIMATION_SPEED), z); // Increase speed of box moving in y posiiton

    // If they are greater than the  height, reset them to the opposite side

    if (data.y > height / 1.5) {
      data.y = -height / 1.5;
    }
  });

  return (
    <mesh
      ref={ref}
      geometry={nodes.Object_2.geometry}
      material={materials.Banana_High}
      position={[0.348, 1.444, -0.085]}
      material-emissive="orange"
    />
  );
}

function App() {
  return (
    <>
      <Canvas gl={{ alpha: false }} camera={{ near: 0.01, far: 110, fov: 40 }}>
        <color args={["#f6c157"]} attach="background" />
        <spotLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          {Array.from({ length: COUNT }, (_, i) => (
            <Banana key={i} z={(-i / COUNT) * DEPTH_OF_FIELD - 10} />
          ))}

          <EffectComposer>
            <DepthOfField
              traget={[0, 0, DEPTH_OF_FIELD / 2]}
              focalLength={0.8}
              bokehScale={11}
              height={700}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </>
  );
}

export default App;
