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

  // ROTATION LOOP (With strict node validation checks)
  useFrame(() => {
    const rotatingNodes = [
      'Donut',
      'French_Fries_Potato',
      'Planet_Empty',
      'Planet_H_Empty',
      'Astro_Cat',
    ];

    rotatingNodes.forEach((name) => {
      const node = nodes[name];
      if (node) {
        node.rotation.y += 0.01;
      }
    });
  });

  useEffect(() => {
    if (!groupRef.current || !nodes) return;

    // =========================
    // INITIAL POSITIONS SAFETY CHECK
    // =========================
    const burgerPieces = [
      'Burger_Bun_Top',
      'Burger_Tomato',
      'Burger_Cheese',
      'Burger_Patty',
      'Burger_Salad',
      'Burger_Bun_Bottom',
    ];

    burgerPieces.forEach((name, index) => {
      const part = nodes[name];
      if (part) {
        // Reset positions cleanly relative to local coordinate system
        part.position.y = 12 + index * 2;
        part.rotation.y = Math.random() * Math.PI;
      }
    });

    if (nodes.Astro_Cat) nodes.Astro_Cat.position.y = -30;
    if (nodes.Planet_Empty) nodes.Planet_Empty.position.y = -25;
    if (nodes.Planet_H_Empty) nodes.Planet_H_Empty.position.y = -25;
    if (nodes.Donut) nodes.Donut.position.x = -30;
    if (nodes.French_Fries) nodes.French_Fries.position.x = 30;
    if (nodes.Box_Upper_Part) nodes.Box_Upper_Part.rotation.x = -1.5;

      // Tell GSAP to recalculate page metrics from scratch
  ScrollTrigger.refresh();

    // =========================
    // TIMELINE CONFIGURATION
    // =========================
    const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".how-it-works-section",
    start: "top top",
    end: "+=2500", 
    scrub: 1,      
    pin: true,     
    pinSpacing: false, // Disables GSAP's automatic padding block injection
    invalidateOnRefresh: true,
  }
});

    // =========================
    // BURGER BUILD ANIMATION
    // =========================
    burgerPieces.forEach((name, index) => {
      const part = nodes[name];
      if (part) {
        tl.to(part.position, {
          y: 0,
          duration: 1,
          ease: 'back.out(1.4)',
        }, index * 0.2);

        tl.to(part.rotation, {
          y: 0,
          duration: 1,
        }, index * 0.2);
      }
    });

    // =========================
    // CAT + PLANETS ANIMATION
    // =========================
    if (nodes.Astro_Cat && nodes.Planet_Empty && nodes.Planet_H_Empty) {
      tl.to(nodes.Astro_Cat.position, { y: 0, duration: 2 }, '+=0.5');
      tl.to(nodes.Planet_Empty.position, { y: 0, duration: 2 }, '<');
      tl.to(nodes.Planet_H_Empty.position, { y: 0, duration: 2 }, '<');
    }

    // =========================
    // DONUT + FRIES ANIMATION
    // =========================
    if (nodes.Donut && nodes.French_Fries) {
      tl.to(nodes.Donut.position, { x: 0, duration: 2 }, '+=0.5');
      tl.to(nodes.French_Fries.position, { x: 0, duration: 2 }, '<');
    }

    // =========================
    // PACK INTO BOX ANIMATION
    // =========================
    const objectsToPack = ['Burger', 'Donut', 'French_Fries', 'Astro_Cat'];
    objectsToPack.forEach((name) => {
      const obj = nodes[name];
      if (obj) {
        tl.to(obj.position, { x: 0, y: -3, z: 0, duration: 2 }, '+=0.5');
        tl.to(obj.rotation, { y: Math.PI * 4, duration: 2 }, '<');
        tl.to(obj.scale, { x: 0.6, y: 0.6, z: 0.6, duration: 2 }, '<');
      }
    });

    // =========================
    // CLOSE BOX ANIMATION
    // =========================
    if (nodes.Box_Upper_Part) {
      tl.to(nodes.Box_Upper_Part.rotation, {
        x: 0,
        duration: 1.5,
        ease: 'power2.inOut',
      }, '+=0.3');
    }

    return () => {
    tl.kill();
    ScrollTrigger.getAll().forEach(t => t.kill());
  };
  }, [nodes]);

  return (
    <>
      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
      <ambientLight intensity={2.5} />
      <directionalLight position={[5, 10, 7]} intensity={4.5} />
    </>
  );
}