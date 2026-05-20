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

    // Reset root scene properties to keep everything framed perfectly in the center
    scene.scale.setScalar(4.5); 
    scene.position.set(0, 0, 0); 
    scene.rotation.set(0, 0, 0);

    const burgerParts = [
      'Burger_Part_02', 'Burger_Part_03', 'Burger_Part_04', 'Burger_Part_05',
      'Burger_Part_06', 'Burger_Part_07', 'Burger_Part_08', 'Burger_Part_09', 'Burger_Part_10'
    ];

    // 1. Initial Positioning out of view boundaries (High in the sky)
    burgerParts.forEach((name, i) => {
      const part = nodes[name];
      if (part) {
        part.position.set(0, 25 + i * 2, 0); 
        part.rotation.set(0, Math.PI * (i + 1) * 0.25, 0); 
        part.scale.setScalar(1);
      }
    });

    if (nodes.Astro_Cat) nodes.Astro_Cat.position.set(0, -45, -5);
    if (nodes.Planet_Empty) nodes.Planet_Empty.position.set(-18, -45, -10);
    if (nodes.Planet_H_Empty) nodes.Planet_H_Empty.position.set(18, -45, -10);
    if (nodes.Meteor_Empty) nodes.Meteor_Empty.position.set(-8, -50, -5);
    
    if (nodes.Donut) nodes.Donut.position.set(-45, 0, 0);
    if (nodes.French_Fries) nodes.French_Fries.position.set(45, 0, 0);

    // Box initial setup (Hidden down below, ready wide open)
    if (nodes.Box) {
      nodes.Box.position.set(0, -45, 0);
      nodes.Box.rotation.set(0, 0, 0); 

      if (nodes.Box_Upper_Part) {
        // Keeps the lid opened on its local Z pivot hinge
        nodes.Box_Upper_Part.rotation.set(0, 0, -Math.PI / 1.3); 
      }
    }

    // 2. Main timeline linked with scroll duration length
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".how-it-works-section",
        start: "top top",
        end: "+=3500", // Increased scroll track space to let animations breathe
        scrub: 1,
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true,
      }
    });

    // STEP 1: Burger parts descend and stack tightly on top of each other right at the screen center
    tl.addLabel("burgerAssemble");
    burgerParts.forEach((name, index) => {
      const part = nodes[name];
      if (part) {
        tl.to(part.position, {
          x: 0,
          y: -0.8 + (index * 0.04), // Perfectly tight, zero-gap stacking position mapping
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

    // 💡 HOLD THE ASSEMBLED BURGER ON SCREEN (Creates a visual pause for the user)
    tl.to({}, { duration: 2 }); 

    // STEP 2: Bring side snacks and cosmic items into view to join the burger assembly
    tl.addLabel("spaceElementsRise");
    if (nodes.Astro_Cat) {
      tl.to(nodes.Astro_Cat.position, { y: -2, z: 2, duration: 4, ease: "power1.out" }, "spaceElementsRise");
    }
    if (nodes.Planet_Empty) {
      tl.to(nodes.Planet_Empty.position, { y: 12, x: -15, duration: 4, ease: "power1.out" }, "spaceElementsRise");
    }
    if (nodes.Planet_H_Empty) {
      tl.to(nodes.Planet_H_Empty.position, { y: -8, x: 16, duration: 4, ease: "power1.out" }, "spaceElementsRise");
    }
    if (nodes.Meteor_Empty) {
      tl.to(nodes.Meteor_Empty.position, { y: 3, x: -11, duration: 4, ease: "power1.out" }, "spaceElementsRise");
    }

    tl.addLabel("snacksIn", "-=2");
    if (nodes.Donut) {
      tl.to(nodes.Donut.position, { x: -11, y: 1, z: 4, duration: 3.5, ease: "back.out(1)" }, "snacksIn");
      tl.to(nodes.Donut.rotation, { y: Math.PI * 4, duration: 3.5 }, "snacksIn");
    }
    if (nodes.French_Fries) {
      tl.to(nodes.French_Fries.position, { x: 11, y: 1, z: 4, duration: 3.5, ease: "back.out(1)" }, "snacksIn");
      tl.to(nodes.French_Fries.rotation, { y: -Math.PI * 4, duration: 3.5 }, "snacksIn");
    }

    // 💡 VISUAL PAUSE: Keep all items fully formed on screen before the box arrives
    tl.to({}, { duration: 2 });

    // STEP 3: Box rises straight up directly underneath the assembled items
    tl.addLabel("boxArrival");
    if (nodes.Box) {
      tl.to(nodes.Box.position, { y: -3.5, duration: 3, ease: "power2.out" }, "boxArrival");
    }
    
    // Clear ambient background objects away to clean up the workspace
    if (nodes.Planet_Empty) tl.to(nodes.Planet_Empty.position, { y: 35, duration: 2 }, "boxArrival");
    if (nodes.Planet_H_Empty) tl.to(nodes.Planet_H_Empty.position, { y: -35, duration: 2 }, "boxArrival");
    if (nodes.Meteor_Empty) tl.to(nodes.Meteor_Empty.position, { y: -35, duration: 2 }, "boxArrival");

    // STEP 4: Package EVERYTHING down inside the box so they vanish completely
    const insideBoxTargets = [
      'Donut', 'French_Fries', 'Astro_Cat',
      ...burgerParts
    ];

    tl.addLabel("packInside", "+=0.5");
    insideBoxTargets.forEach((name) => {
      const obj = nodes[name];
      if (obj) {
        tl.to(obj.position, {
          x: 0,
          y: -5.5, // Pulls down completely below the rim line of the delivery box container
          z: 0,
          duration: 3,
          ease: "power2.in"
        }, "packInside");

        tl.to(obj.scale, {
          x: 0.001,
          y: 0.001,
          z: 0.001, // Shrinks them down out of sight inside the container
          duration: 2.7,
          ease: "power2.in"
        }, "packInside");
      }
    });

    // STEP 5: Snap the container lid completely shut over the front opening face
    tl.addLabel("boxClosing", "+=0.2");
    if (nodes.Box_Upper_Part) {
      tl.to(nodes.Box_Upper_Part.rotation, {
        x: 0, 
        y: 0,
        z: 0, // Returns to original zero angle to firmly snap close
        duration: 2.5,
        ease: "bounce.out" 
      }, "boxClosing");
    }

    // Proudly display the clean closed box until scroll area finishes
    if (nodes.Box) {
      tl.to(nodes.Box.position, { y: -3.5, duration: 2 }, "+=0.5");
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