import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Global mouse tracking that works even when overlays block pointer events
const mouse = { x: 0, y: 0 };
if (typeof window !== "undefined") {
    window.addEventListener("mousemove", (e) => {
        // Normalize to -1 to 1 range, matching Three.js convention
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
}

// Floating Spheres — 500 metallic spheres scattered in 3D space
const Spheres = () => {
    const meshRef = useRef<THREE.InstancedMesh>(null!);
    const count = 500;
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const sphereData = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            temp.push({
                position: new THREE.Vector3(
                    Math.random() * 10 - 5,
                    Math.random() * 10 - 5,
                    Math.random() * 10 - 5
                ),
                scale: Math.random() * 0.15 + 0.05,
            });
        }
        return temp;
    }, []);

    useEffect(() => {
        sphereData.forEach((s, i) => {
            dummy.position.copy(s.position);
            dummy.scale.setScalar(s.scale);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [dummy, sphereData]);

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 32, 16]} />
            <meshPhysicalMaterial
                color="#8cb4f0"
                roughness={0.1}
                metalness={0.9}
                emissive="#0a1e3d"
                emissiveIntensity={0.5}
                clearcoat={1}
                clearcoatRoughness={0.1}
            />
        </instancedMesh>
    );
};

// Camera Controller — smoothly follows the mouse, exactly like the Three.js example
const CameraController = () => {
    const { camera } = useThree();

    useFrame(() => {
        // The Three.js example uses: camera.position.x += (mouseX/2 - camera.position.x) * 0.05
        // We replicate it here using the global mouse tracker
        const targetX = mouse.x * 5;
        const targetY = mouse.y * 3;

        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (targetY - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
    });

    return null;
};

export const Hero3D = () => {
    return (
        <div className="w-full h-full absolute inset-0 z-0">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                dpr={[1, 2]}
                gl={{ antialias: true }}
                onCreated={({ scene }) => {
                    scene.background = new THREE.Color(0x050512);
                }}
            >
                {/* Lighting setup matching the Three.js example */}
                <ambientLight intensity={0.3} color="#ffffff" />
                <directionalLight position={[0, 0, 1]} intensity={1.5} color="#ffffff" />
                <pointLight position={[5, 3, 5]} intensity={3} distance={20} color="#88ccff" />
                <pointLight position={[-5, -3, -5]} intensity={2} distance={20} color="#ff88cc" />
                <pointLight position={[0, 5, 0]} intensity={2} distance={15} color="#ffffff" />

                <Spheres />
                <CameraController />
            </Canvas>
        </div>
    );
};
