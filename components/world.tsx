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
                position={[0, -1, 0]}
                rotationDelta={[0.01, 0.005, -0.009]}
                dimensions={[0.7, 32, 32]}
                orbitPeriod={5}
                semiMajor={5}
                eccentricity={0.0167112}
            />
            <Planet
                position={[0, -1, 0]}
                rotationDelta={[-0.01, -0.005, 0.009]}
                dimensions={[0.2, 32, 32]}
                orbitPeriod={2}
                semiMajor={1}
                eccentricity={0.8}
            />
        </Canvas>
    );
}
