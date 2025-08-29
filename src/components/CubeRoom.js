import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function CubeRoom({ color }) {
  return (
    <Canvas style={{ height: "80vh", width: "100%" }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <mesh rotation={[0.5, 0.5, 0]}>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
}

export default CubeRoom;
