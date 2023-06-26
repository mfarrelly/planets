import { Suspense, createRef, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import React from "react";
import { Planet, PlanetProps } from "./planet";
import * as THREE from "three";
import { TextureLoader } from "three";

import sunImage from "./assets/textures/sun.jpg";
import earthImage from "./assets/textures/earth.jpg";
import venusImage from "./assets/textures/venus.jpg";
import mercuryImage from "./assets/textures/mercury.jpg";

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

export function Scene(props: { focusItem: string | null }) {
    const planetRefSun = createRef<THREE.Mesh>();
    const planetRefMercury = createRef<THREE.Mesh>();
    const planetRefVenus = createRef<THREE.Mesh>();
    const planetRefEarth = createRef<THREE.Mesh>();

    const sunMaterial = useLoader(TextureLoader, sunImage);
    const earthMaterial = useLoader(TextureLoader, earthImage);
    const venusMaterial = useLoader(TextureLoader, venusImage);
    const mercuryMaterial = useLoader(TextureLoader, mercuryImage);

    useFrame((state) => {
        //
        if (props.focusItem) {
            if (props.focusItem === "sun" && planetRefSun.current) {
                state.camera.lookAt(planetRefSun.current.position);
            }
            if (props.focusItem === "mercury" && planetRefMercury.current) {
                state.camera.lookAt(planetRefMercury.current.position);
            }
            if (props.focusItem === "venus" && planetRefVenus.current) {
                state.camera.lookAt(planetRefVenus.current.position);
            }
            if (props.focusItem === "earth" && planetRefEarth.current) {
                state.camera.lookAt(planetRefEarth.current.position);
            }
        }
    });

    return (
        <>
            <ambientLight color="#666" />
            <pointLight position={[0, -10, -50]} color="white" />
            <color attach="background" args={["#000"]} />
            <Planet
                {...adjustProps({
                    position: [0, -10, -50],
                    rotationDelta: [0.0, 0.0, 0],
                    dimensions: [139040, 32, 32],
                    orbitPeriod: 0,
                    semiMajor: 0,
                    eccentricity: 0,
                })}
                ignoreHover
                ref={planetRefSun}
            >
                <meshStandardMaterial map={sunMaterial} />
            </Planet>
            <Planet
                {...adjustProps({
                    position: [0, -10, -50],
                    rotationDelta: [0.0, 0.005, 0],
                    dimensions: [4884, 32, 32],
                    orbitPeriod: 1,
                    semiMajor: 0.387098,
                    eccentricity: 0.20563,
                })}
                ref={planetRefMercury}
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
                ref={planetRefVenus}
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
                ref={planetRefEarth}
            >
                <meshStandardMaterial map={earthMaterial} />
            </Planet>
        </>
    );
}

export function World(props: { focusItem: string | null }) {
    return (
        <Canvas>
            <Suspense fallback={null}>
                <Scene focusItem={props.focusItem} />
            </Suspense>
        </Canvas>
    );
}
