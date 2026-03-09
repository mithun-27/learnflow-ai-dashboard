import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import * as THREE from "three";

const AnimatedKnot = () => {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state, delta) => {
        meshRef.current.rotation.x += delta * 0.2;
        meshRef.current.rotation.y += delta * 0.3;
    });

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            <mesh ref={meshRef}>
                <torusKnotGeometry args={[1.5, 0.4, 256, 64]} />
                <meshPhysicalMaterial
                    color="#3b82f6" // base blue
                    emissive="#1d4ed8" // deeper blue internal glow
                    emissiveIntensity={0.2}
                    roughness={0.1}
                    metalness={0.8}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    iridescence={1}
                    iridescenceIOR={1.5}
                    iridescenceThicknessRange={[100, 400]}
                />
            </mesh>
        </Float>
    );
};

export const Hero3D = () => {
    return (
        <div className="w-full h-full absolute inset-0 -z-10">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
                <directionalLight position={[-10, -10, -5]} intensity={1} color="#60a5fa" />

                {/* Soft studio environment lighting */}
                <Environment preset="city" />

                <AnimatedKnot />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};
