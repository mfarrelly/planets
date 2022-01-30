import { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import React from "react";
import { Planet, PlanetProps } from "./planet";
import * as THREE from "three";
import { TextureLoader } from "three";

/**
 * Scales the props to be easier numbers.
 */
function adjustProps({
    dimensions = [0, 0, 0],
    position = [0, 0, 0],
    semiMajor = 5,
    orbitPeriod = 1,
    ...input
}: PlanetProps): PlanetProps {
    if (!dimensions[0]) {
        dimensions[0] = 0;
    }

    const width = dimensions[0] / 12000;

    if (Array.isArray(position)) {
        position = [position[0], position[1] - width / 2, position[2]];
    }

    return {
        dimensions: [width, dimensions[1], dimensions[2]],
        position: position,
        semiMajor: semiMajor * 50,
        orbitPeriod: orbitPeriod * 5,
        ...input,
    };
}

export function Scene() {
    const earthMaterial = useLoader(TextureLoader, "textures/earth.jpg");
    const venusMaterial = useLoader(TextureLoader, "textures/venus.jpg");
    const mercuryMaterial = useLoader(TextureLoader, "textures/mercury.jpg");
    return (
        <>
            <ambientLight color="#030" />
            <pointLight position={[0, 10, 10]} color="white" />

            <Planet
                {...adjustProps({
                    position: [0, -10, -50],
                    rotationDelta: [0.0, 0.005, 0],
                    dimensions: [4884, 32, 32],
                    orbitPeriod: 1,
                    semiMajor: 0.387098,
                    eccentricity: 0.20563,
                })}
            >
                <meshStandardMaterial map={mercuryMaterial} />
            </Planet>
            <Planet
                {...adjustProps({
                    position: [0, -10, -50],
                    rotationDelta: [0.0, 0.005, 0],
                    dimensions: [12116, 32, 32],
                    orbitPeriod: 0.615,
                    semiMajor: 0.723332,
                    eccentricity: 0.00677323,
                })}
            >
                <meshStandardMaterial map={venusMaterial} />
            </Planet>
            <Planet
                {...adjustProps({
                    position: [0, -10, -50],
                    rotationDelta: [0.0, 0.005, 0],
                    dimensions: [12756, 32, 32],
                    orbitPeriod: 1,
                    semiMajor: 1,
                    eccentricity: 0.0167112,
                })}
            >
                <meshStandardMaterial map={earthMaterial} />
            </Planet>
        </>
    );
}

export function World() {
    return (
        <Canvas>
            <Suspense fallback={null}>
                <Scene />
            </Suspense>
        </Canvas>
    );
}
