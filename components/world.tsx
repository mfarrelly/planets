import { Canvas } from "@react-three/fiber";
import React from "react";
import { Planet } from "./planet";
import * as THREE from "three";

export function World() {
    return (
        <Canvas>
            <ambientLight color="#030" />
            <pointLight position={[0, 10, 10]} color="red" />
            <Planet
                position={[0, 0, 0]}
                rotationDelta={[0.01, 0.005, -0.009]}
                // moveFunc={(props, d, t, p) => {
                //     const nextPosition = new THREE.Vector3(
                //         Math.sin(t) * -d,
                //         0,
                //         Math.cos(t) * d
                //     );

                //     return nextPosition;
                // }}
                orbitPeriod={5}
                semiMajor={5}
                eccentricity={0.0167112}
            />
            <Planet
                position={[0, 0, 0]}
                rotationDelta={[-0.01, -0.005, 0.009]}
                // moveFunc={(props, d, t, p) => {
                //     const nextPosition = new THREE.Vector3(
                //         Math.sin(t) * d,
                //         0,
                //         Math.cos(t) * d
                //     );

                //     return nextPosition;
                // }}

                orbitPeriod={2}
                semiMajor={1}
                eccentricity={0.0167112}
            />
        </Canvas>
    );
}
