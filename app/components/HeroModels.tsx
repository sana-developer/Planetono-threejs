import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, Text, useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const MODEL_CONFIGS = [
  {
    key: "Burger_Menu_Empty",
    position: [8.5, 2.9, 6.8] as [number, number, number],
    rotation: [1.0, -2.8, 0] as [number, number, number],
    spinNodes: ["Burger", "Donut", "French_Fries"],
  },
  {
    key: "Pizza_Menu_Empty",
    position: [8.5, 2.9, 6.8] as [number, number, number],
    rotation: [1.0, -2.8, 0] as [number, number, number],
    spinNodes: ["Astro_Koala", "Pizza_French_Fries", "Pizza_Triangulate_3", "Coffee_Topping"],
  },
  {
    key: "Hotdog_Menu_Empty",
    position: [8.5, 2.9, 6.8] as [number, number, number],
    rotation: [1.0, -2.8, 0] as [number, number, number],
    spinNodes: ["Astro_Chik", "French_Fries_Potato.002", "Plane_2", "Ice_Cream_Toping", "Plane_5" ],
  },
];

interface HeroModelsProps {
  activeIndex: number;
}

export default function HeroModels({ activeIndex }: HeroModelsProps) {
  const modelRef = useRef<any>();
  const groupRef = useRef<THREE.Group>(null);
  const model = useGLTF("/models/slider_model.glb");
  const config = MODEL_CONFIGS[activeIndex];

  useThree(({ gl }) => {
    gl.toneMapping = THREE.ReinhardToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  });

  const { actions } = useAnimations(model.animations, model.scene);

  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach((a) => a?.stop());
      const firstAction = Object.values(actions)[0];
      firstAction?.play();
    }
  }, [actions, activeIndex]);

  useFrame(() => {
    config.spinNodes.forEach((key) => {
      const node = model.nodes[key];
      if (node) node.rotation.y += 0.01;
    });
  });

  const object = model.nodes[config.key];
  if (!object) return null;

  useEffect(() => {
    if (!groupRef.current) return;

    const tl = gsap.timeline();

    // EXIT animation
    tl.fromTo(groupRef.current.position, 
      { x: 80, opacity: 1, duration: 0.6, ease: "power3.out" },
      { x: 0, opacity: 0 });

    // RESET position instantly after exit
    tl.set(groupRef.current.position, { x: 5 });

    // ENTER animation with bounce
    tl.to(groupRef.current.position, {
      x: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
    });
  }, [activeIndex]);

  return (
    <>
      <group ref={groupRef}>
        <primitive
          object={object}
          position={config.position}
          rotation={config.rotation}
          scale={1.2}
        />
      </group>
      {/* <Environment preset="sunset" /> */}
      
      <directionalLight position={[0, 5, 5]} color={0xffffff} intensity={10} />
      {/* <OrbitControls /> */}
    </>
  );
}