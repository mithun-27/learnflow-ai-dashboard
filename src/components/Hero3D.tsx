import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ParallaxBarrierEffect } from "three/addons/effects/ParallaxBarrierEffect.js";

// Stereoscopic Parallax Barrier Effect
const Effect = () => {
    const { gl, scene, camera, size } = useThree();
    const effect = useMemo(() => new ParallaxBarrierEffect(gl), [gl]);

    useEffect(() => {
        effect.setSize(size.width, size.height);
    }, [effect, size]);

    useFrame(() => {
        // Priority 1 renders after everything else
        effect.render(scene, camera);
    }, 1);

    return null;
};

// Background Environment Setup 
const EnvironmentSetup = () => {
    const { scene } = useThree();

    useEffect(() => {
        scene.background = new THREE.Color(0x050512); // Deep space blue/black
    }, [scene]);

    return null;
};

// Floating Spheres Instanced rendering
const Spheres = () => {
    const meshRef = useRef<THREE.InstancedMesh>(null!);
    const count = 500;
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Generate random positions and scales for the spheres
    const spheres = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            temp.push({
                position: new THREE.Vector3(
                    Math.random() * 10 - 5,
                    Math.random() * 10 - 5,
                    Math.random() * 10 - 5
                ),
                scale: Math.random() + 0.5, // sizes between 0.5 and 1.5
            });
        }
        return temp;
    }, [count]);

    useEffect(() => {
        spheres.forEach((sphere, i) => {
            dummy.position.copy(sphere.position);
            dummy.scale.setScalar(sphere.scale * 0.15); // Adjust scale appropriately 
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [dummy, spheres]);

    const { pointer, camera, scene } = useThree();

    useFrame(() => {
        // Drastically increased multiplier from 10 to 40 for a very wide, noticeable parallax swing
        const targetX = pointer.x * 40;
        const targetY = pointer.y * 40;

        // Increased lerp speed from 0.1 to 0.2 for much faster, snappier movement
        camera.position.x += (targetX - camera.position.x) * .2;
        camera.position.y += (targetY - camera.position.y) * .2;
        camera.lookAt(scene.position); // Always look at origin
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 32, 16]} />
            <meshStandardMaterial
                color="#ffffff"
                roughness={0.1}
                metalness={0.8}
                emissive="#0a2a5a"
                emissiveIntensity={0.6}
            />
        </instancedMesh>
    );
};

export const Hero3D = () => {
    return (
        // Set to z-0 so it sits fully above any default backgrounds on the page root
        <div className="w-full h-full absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 3], fov: 60 }} dpr={[1, 2]}>
                <EnvironmentSetup />

                {/* Lights reflecting off the metallic spheres */}
                <ambientLight intensity={0.5} color="#ffffff" />
                <directionalLight position={[10, 10, 5]} intensity={3} color="#ffffff" />
                <directionalLight position={[-10, -10, -5]} intensity={2} color="#60a5fa" />
                <pointLight position={[0, 0, 0]} intensity={1.5} color="#ffaaee" />

                <Spheres />
                <Effect />
            </Canvas>
        </div>
    );
};
