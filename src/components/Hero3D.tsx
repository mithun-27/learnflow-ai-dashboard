import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Custom auto-rotating component to replace OrbitControls
const AutoRotatingCamera = () => {
    const { camera } = useThree();

    useFrame((state) => {
        // Slowly rotate camera around the origin
        const speed = 0.5;
        const radius = 6;
        const angle = state.clock.elapsedTime * speed;

        camera.position.x = Math.sin(angle) * radius;
        camera.position.z = Math.cos(angle) * radius;
        camera.lookAt(0, 0, 0);
    });

    return null;
};

const AnimatedKnot = () => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state, delta) => {
        // Base object rotation
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2;
            meshRef.current.rotation.y += delta * 0.3;
        }

        // Float effect to replace <Float>
        if (groupRef.current) {
            const t = state.clock.elapsedTime;
            groupRef.current.position.y = Math.sin(t * 2) * 0.2; // Float up and down
            groupRef.current.rotation.x = Math.cos(t * 1.5) * 0.1; // Slight wobble
            groupRef.current.rotation.z = Math.sin(t * 1.5) * 0.1; // Slight wobble
        }
    });

    return (
        <group ref={groupRef}>
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
        </group>
    );
};

export const Hero3D = () => {
    return (
        <div className="w-full h-full absolute inset-0 -z-10">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                {/* Expanded lighting setup to replace <Environment /> */}
                <ambientLight intensity={1.5} color="#ffffff" />
                <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={3} color="#aaddff" />
                <directionalLight position={[-10, -10, -5]} intensity={2} color="#60a5fa" />
                <directionalLight position={[10, -10, 5]} intensity={1.5} color="#ffaaee" />
                <pointLight position={[0, 5, -5]} intensity={2} color="#ffffff" />

                <AnimatedKnot />
                <AutoRotatingCamera />
            </Canvas>
        </div>
    );
};
