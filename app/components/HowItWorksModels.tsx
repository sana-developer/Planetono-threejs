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
      nodes.Burger.scale.setScalar(1);
    }

    // Spread pieces way up high in the sky initially inside the Burger group coordinate matrix
    orderedBurgerParts.forEach((name, i) => {
      const part = nodes[name];
      if (part) {
        part.position.set(0, 25 + (i * 2.5), 0); // Cascaded entry coordinates
        part.rotation.set(0, Math.PI * (i + 1) * 0.25, 0);
        part.scale.setScalar(1);
      }
    });

    // Keep background elements at their distant positions
    if (nodes.Astro_Cat) nodes.Astro_Cat.position.set(0, -45, -5);
    if (nodes.Planet_Empty) nodes.Planet_Empty.position.set(-18, -45, -10);
    if (nodes.Planet_H_Empty) nodes.Planet_H_Empty.position.set(18, -45, -10);
    if (nodes.Meteor_Empty) nodes.Meteor_Empty.position.set(-8, -50, -5);

    if (nodes.Donut) nodes.Donut.position.set(-45, 0, 0);
    if (nodes.French_Fries) nodes.French_Fries.position.set(45, 0, 0);

    // Dynamic rotation proxy tracker for the lid opening/closing calculations
    const lidState = { angle: -1.75, posY: 1.15, posZ: -1.1 };

    // Box initial hidden setup down below
    if (nodes.Box) {
      nodes.Box.position.set(0, -45, 0);
      nodes.Box.rotation.set(0, Math.PI / 5, 0);

      if (nodes.Box_Upper_Part) {
        // Clear out raw local orientations that trigger the upside down flipping bug
        nodes.Box_Upper_Part.rotation.set(0, 0, 0);
        nodes.Box_Upper_Part.position.set(0, 0, 0);
      }
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
        // Safe updates during the scrubbing phase to keep lid correctly tracked
        if (nodes.Box_Upper_Part) {
          nodes.Box_Upper_Part.rotation.x = lidState.angle;
          nodes.Box_Upper_Part.position.y = lidState.posY;
          nodes.Box_Upper_Part.position.z = lidState.posZ;
        }
      }
    });

    // STEP 1: Pieces descend into position while the whole master container flies right to the camera face
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
          y: index * 0.015,
          z: 0,
          duration: 3,
        }, `burgerAssemble+=${index * 0.15}`);

        tl.to(part.rotation, {
          x: 0,
          y: 0,
          z: 0,
          duration: 3,
        }, `burgerAssemble+=${index * 0.15}`);
      }
    });

    // COGNITIVE PAUSE: Keep the massive close-up burger floating front and center
    tl.to({}, { duration: 2 });

    // STEP 2: Side snacks and space elements drift smoothly into view behind the giant burger
    tl.addLabel("spaceElementsRise");
    if (nodes.Astro_Cat) {
      tl.to(nodes.Astro_Cat.position, { y: -1.5, z: 3, duration: 4, ease: "power1.out" }, "spaceElementsRise");
    }
    if (nodes.Planet_Empty) {
      tl.to(nodes.Planet_Empty.position, { y: 12, x: -16, duration: 4, ease: "power1.out" }, "spaceElementsRise");
    }
    if (nodes.Planet_H_Empty) {
      tl.to(nodes.Planet_H_Empty.position, { y: -8, x: 17, duration: 4, ease: "power1.out" }, "spaceElementsRise");
    }
    if (nodes.Meteor_Empty) {
      tl.to(nodes.Meteor_Empty.position, { y: 4, x: -12, duration: 4, ease: "power1.out" }, "spaceElementsRise");
    }

    tl.addLabel("snacksIn", "-=2");
    if (nodes.Donut) {
      tl.to(nodes.Donut.position, { x: -12, y: 0.5, z: 3, duration: 3.5, ease: "back.out(1.2)" }, "snacksIn");
      tl.to(nodes.Donut.rotation, { y: Math.PI * 2, duration: 3.5 }, "snacksIn");
    }
    if (nodes.French_Fries) {
      tl.to(nodes.French_Fries.position, { x: 12, y: 0.5, z: 3, duration: 3.5, ease: "back.out(1.2)" }, "snacksIn");
      tl.to(nodes.French_Fries.rotation, { y: -Math.PI * 2, duration: 3.5 }, "snacksIn");
    }

    // COGNITIVE PAUSE: Hold layout components together on screen
    tl.to({}, { duration: 2 });

    // STEP 3: Box rises straight up from the bottom with its lid explicitly kept open
    tl.addLabel("boxArrival");
    if (nodes.Box) {
      tl.to(nodes.Box.position, { y: -3.8, duration: 3, ease: "power2.out" }, "boxArrival");
    }

    // Explicitly lock proxy values to wide open configuration while rising
    tl.to(lidState, { angle: -1.75, posY: 1.15, posZ: -1.1, duration: 3 }, "boxArrival");

    // Clear out distant background space clutter
    if (nodes.Planet_Empty) tl.to(nodes.Planet_Empty.position, { y: 35, duration: 2 }, "boxArrival");
    if (nodes.Planet_H_Empty) tl.to(nodes.Planet_H_Empty.position, { y: -35, duration: 2 }, "boxArrival");
    if (nodes.Meteor_Empty) tl.to(nodes.Meteor_Empty.position, { y: -35, duration: 2 }, "boxArrival");

    // STEP 4: Package everything into the open box base container
    tl.addLabel("packInside", "+=0.3");

    if (nodes.Burger) {
      tl.to(nodes.Burger.position, { x: 0, y: -5.5, z: 0, duration: 3, ease: "power2.in" }, "packInside");
      tl.to(nodes.Burger.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 2.5, ease: "power2.in" }, "packInside");
    }

    const insideBoxTargets = ['Donut', 'French_Fries', 'Astro_Cat'];
    insideBoxTargets.forEach((name) => {
      const obj = nodes[name];
      if (obj) {
        tl.to(obj.position, { x: 0, y: -5.5, z: 0, duration: 3, ease: "power2.in" }, "packInside");
        tl.to(obj.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 2.5, ease: "power2.in" }, "packInside");
      }
    });

    // Make sure proxy track holds the open position completely steady while items descend
    tl.to(lidState, { angle: -1.75, posY: 1.15, posZ: -1.1, duration: 3 }, "packInside");

    // STEP 5: Smoothly snap and seal the box lid completely closed back down onto base origin (0,0,0)
    tl.addLabel("boxClosing", "+=0.2");
    tl.to(lidState, {
      angle: 0,
      posY: 0,
      posZ: 0,
      duration: 2.5,
      ease: "bounce.out"
    }, "boxClosing");

    // Keep displaying the final closed box until the section finishes scrolling
    if (nodes.Box) {
      tl.to(nodes.Box.position, { y: -3.8, duration: 2 }, "+=0.5");
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
      <ambientLight intensity={1.8} />
      <directionalLight position={[0, 20, 30]} intensity={2.5} castShadow />
      <directionalLight position={[15, 5, -10]} intensity={0.4} />
      <pointLight position={[0, -1, 10]} intensity={1.6} distance={25} />
    </>
  );
}