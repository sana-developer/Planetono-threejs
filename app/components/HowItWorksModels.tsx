'use client';

import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorksModels() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, nodes } = useGLTF('/models/scroll_model.glb');

  useFrame((state) => {
    const dynamicNodes = ['Donut', 'French_Fries', 'Planet_Empty', 'Planet_H_Empty', 'Astro_Cat', 'Meteor_Empty'];
    dynamicNodes.forEach((name) => {
      const node = nodes[name];
      if (node && node.position.y > -20 && node.position.y < 20) {
        node.rotation.y += 0.005;
      }
    });
  });

  useEffect(() => {
    if (!groupRef.current || !nodes) return;

    // 1. Scene Root Calibration - Baseline alignment
    scene.scale.setScalar(4.2);
    scene.position.set(0, -0.5, 0);
    scene.rotation.set(0, 0, 0);

    // Disable frustum culling for all child meshes to prevent negative scale culling issues
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.frustumCulled = false;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Explicit order from bottom piece to top piece
    const orderedBurgerParts = [
      'Burger_Part_10', // Bottom Bun
      'Burger_Part_09',
      'Burger_Part_08',
      'Burger_Part_07',
      'Burger_Part_06',
      'Burger_Part_05',
      'Burger_Part_04',
      'Burger_Part_03',
      'Burger_Part_02'  // Top Bun
    ];

    // Reset the master container group properties
    if (nodes.Burger) {
      nodes.Burger.position.set(0, 0, 0);
      nodes.Burger.scale.setScalar(6);
    }

    // Spread pieces way up high in the sky initially inside the Burger group coordinate matrix
    orderedBurgerParts.forEach((name, i) => {
      const part = nodes[name];
      if (part) {
        part.position.set(0, 25 + (i * 2.5), 0); // Cascaded entry coordinates
        part.rotation.set(0, Math.PI * (i + 1) * 0.25, 0);
        part.scale.setScalar(6);
      }
    });

    // Keep background elements at their distant positions
    if (nodes.Astro_Cat) nodes.Astro_Cat.position.set(0, -45, -5);
    if (nodes.Planet_Empty) nodes.Planet_Empty.position.set(-18, -45, -10);
    if (nodes.Planet_H_Empty) nodes.Planet_H_Empty.position.set(18, -45, -10);
    if (nodes.Meteor_Empty) nodes.Meteor_Empty.position.set(-8, -50, -5);

    if (nodes.Donut) nodes.Donut.position.set(-45, 0, 0);
    if (nodes.French_Fries) nodes.French_Fries.position.set(45, 0, 0);

    // Dynamic state tracker for the box lid angle animations
    const lidState = { angle: -2.2 }; // Starts fully wide open

    // Box baseline orientation & initial hidden setup deep below the viewport
    const boxParts = ['Box', 'Box_Bottom_Part', 'Box_Upper_Part_Empty', 'Box_Upper_Part'];
    boxParts.forEach((name) => {
      const part = nodes[name];
      if (part) {
        // Uniform reset to prevent giant/microscopic scaling problems from parent glTF overrides
        part.scale.setScalar(1);
      }
    });

    // Check if there is a main parent Box object or if we manage Box components directly
    const boxContainer = nodes.Box || nodes.Box_Bottom_Part;
    if (boxContainer) {
      boxContainer.position.set(0, -50, 0); // Positioned down at bottom initially
      boxContainer.rotation.set(0, Math.PI / 4, 0); // Slight angle for aesthetic depth
    }

    // Initialize Box Lid default open state positions
    if (nodes.Box_Upper_Part) {
      nodes.Box_Upper_Part.rotation.x = lidState.angle;
    } else if (nodes.Box_Upper_Part_Empty) {
      nodes.Box_Upper_Part_Empty.rotation.x = lidState.angle;
    }

    // 2. Main Scroll Animation Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".how-it-works-section",
        start: "top top",
        end: "+=3500",
        scrub: 1,
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true,
      },
      onUpdate: () => {
        // Ensures lid rotation values update correctly step-by-step during scroll-scrubbing
        if (nodes.Box_Upper_Part) {
          nodes.Box_Upper_Part.rotation.x = lidState.angle;
        } else if (nodes.Box_Upper_Part_Empty) {
          nodes.Box_Upper_Part_Empty.rotation.x = lidState.angle;
        }
      }
    });

    // STEP 1: Pieces descend into position
    tl.addLabel("burgerAssemble");
    if (nodes.Burger) {
      tl.to(nodes.Burger.position, { x: 0, y: 0.5, z: 12, duration: 3 }, "burgerAssemble");
      tl.to(nodes.Burger.scale, { x: 2.2, y: 2.2, z: 2.2, duration: 3 }, "burgerAssemble");
    }

    orderedBurgerParts.forEach((name, index) => {
      const part = nodes[name];
      if (part) {
        tl.to(part.position, {
          x: 0,
          y: index * 0.3,
          z: 0,
          duration: 3,
        }, `burgerAssemble+=${index * 0.45}`);

        tl.to(part.rotation, {
          x: 0,
          y: 0,
          z: 0,
          duration: 3,
        }, `burgerAssemble+=${index * 0.15}`);
      }
    });

    // Hold layout
    tl.to({}, { duration: 1 });

    // STEP 2: Side snacks rise and slide into view
    tl.addLabel("spaceElementsRise");
    if (nodes.Astro_Cat) tl.to(nodes.Astro_Cat.position, { y: -1.5, z: 3, duration: 4 }, "spaceElementsRise");
    if (nodes.Planet_Empty) tl.to(nodes.Planet_Empty.position, { y: 12, x: -16, duration: 4 }, "spaceElementsRise");
    if (nodes.Planet_H_Empty) tl.to(nodes.Planet_H_Empty.position, { y: -8, x: 17, duration: 4 }, "spaceElementsRise");
    if (nodes.Meteor_Empty) tl.to(nodes.Meteor_Empty.position, { y: 4, x: -12, duration: 4 }, "spaceElementsRise");

    tl.addLabel("snacksIn", "-=2");
    if (nodes.Donut) {
      tl.to(nodes.Donut.position, { x: -12, y: 0.5, z: 3, duration: 3.5, ease: "back.out(1.2)" }, "snacksIn");
    }
    if (nodes.French_Fries) {
      tl.to(nodes.French_Fries.position, { x: 12, y: 0.5, z: 3, duration: 3.5, ease: "back.out(1.2)" }, "snacksIn");
    }

    // Hold layout
    tl.to({}, { duration: 1 });

    // STEP 3: Box rises up to center of screen completely open
    tl.addLabel("boxArrival");
    if (boxContainer) {
      tl.to(boxContainer.position, { x: 0, y: -2, z: 2, duration: 4, ease: "power2.out" }, "boxArrival");
    }
    // Maintain open configuration while arriving
    tl.to(lidState, { angle: -2.2, duration: 4 }, "boxArrival");

    // Clear distant space background components out of view
    if (nodes.Planet_Empty) tl.to(nodes.Planet_Empty.position, { y: 45, duration: 2 }, "boxArrival");
    if (nodes.Planet_H_Empty) tl.to(nodes.Planet_H_Empty.position, { y: -45, duration: 2 }, "boxArrival");
    if (nodes.Meteor_Empty) tl.to(nodes.Meteor_Empty.position, { y: -45, duration: 2 }, "boxArrival");

    // STEP 4: Package and fit the burger, donut, and fries down inside the box base
    tl.addLabel("packInside", "+=0.2");

    if (nodes.Burger) {
      tl.to(nodes.Burger.position, { x: 0, y: -2.2, z: 2, duration: 3.5, ease: "power2.inOut" }, "packInside");
      tl.to(nodes.Burger.scale, { x: 0.8, y: 0.8, z: 0.8, duration: 3.5 }, "packInside");
    }

    if (nodes.Donut) {
      tl.to(nodes.Donut.position, { x: -2.2, y: -2.2, z: 2.8, duration: 3.5, ease: "power2.inOut" }, "packInside");
      tl.to(nodes.Donut.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 3.5 }, "packInside");
    }

    if (nodes.French_Fries) {
      tl.to(nodes.French_Fries.position, { x: 2.2, y: -2.2, z: 2.8, duration: 3.5, ease: "power2.inOut" }, "packInside");
      tl.to(nodes.French_Fries.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 3.5 }, "packInside");
    }

    if (nodes.Astro_Cat) {
      tl.to(nodes.Astro_Cat.position, { x: 0, y: -2.2, z: 0.8, duration: 3.5, ease: "power2.inOut" }, "packInside");
      tl.to(nodes.Astro_Cat.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 3.5 }, "packInside");
    }

    // STEP 5: Snap and seal the box lid completely closed
    tl.addLabel("boxClosing", "+=0.2");
    tl.to(lidState, {
      angle: 0,
      duration: 3,
      ease: "bounce.out"
    }, "boxClosing");

    // Final hold showcase step
    if (boxContainer) {
      tl.to(boxContainer.position, { y: -2, duration: 2 }, "+=0.5");
    }

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [nodes, scene]);

  return (
    <>
      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
      <ambientLight intensity={2.0} />
      <directionalLight position={[0, 20, 30]} intensity={2.8} castShadow />
      <directionalLight position={[15, 5, -10]} intensity={0.5} />
      <pointLight position={[0, -1, 10]} intensity={1.8} distance={30} />
    </>
  );
}