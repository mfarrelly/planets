import React, { createRef, useMemo, useRef, useState } from "react";
import {
    MeshProps,
    SphereGeometryProps,
    useFrame,
    Vector3,
} from "@react-three/fiber";
import * as THREE from "three";

/**
 * Converts a react-three/fiber Vector3 into a THREE.Vector3.
 */
function asV3(input?: Vector3): THREE.Vector3 {
    if (!input) {
        return new THREE.Vector3(0, 0, 0);
    }
    if (input instanceof THREE.Vector3) {
        return input;
    } else if (Array.isArray(input) && input.length === 3) {
        return new THREE.Vector3(input[0], input[1], input[2]);
    } else if (typeof input == "number") {
        return new THREE.Vector3(input, input, input);
    }
    return new THREE.Vector3(0, 0, 0);
}

export interface PlanetProps extends MeshProps {
    rotationDelta?: Vector3;
    moveDelta?: Vector3;
    moveFunc?: (
        props: PlanetProps,
        delta: number,
        totalTime: number,
        lastPosition: THREE.Vector3
    ) => THREE.Vector3;

    orbitPeriod: number;
    semiMajor: number;
    eccentricity: number;
    dimensions?: SphereGeometryProps["args"];
    ignoreHover?: boolean;
}

function defaultPlanetMove(
    props: PlanetProps,
    delta: number,
    totalTime: number,
    lastPosition: THREE.Vector3
): THREE.Vector3 {
    if (props.orbitPeriod === 0) {
        return new THREE.Vector3(0, 0, 0);
    }
    // mean anomaly
    const M = 2.0 * Math.PI * (totalTime / props.orbitPeriod);
    const a = props.semiMajor;
    const e = props.eccentricity;
    const LOOP_LIMIT = 10;
    // 2) Seed with mean anomaly and solve Kepler's eqn for E
    let u = M; // seed with mean anomoly
    let u_next = 0;
    let loopCount = 0;
    // iterate until within 10-6
    while (loopCount++ < LOOP_LIMIT) {
        // this should always converge in a small number of iterations - but be paranoid
        u_next = u + (M - (u - e * Math.sin(u))) / (1 - e * Math.cos(u));
        if (Math.abs(u_next - u) < 1e-6) {
            break;
        }
        u = u_next;
    }
    const cos_f = (Math.cos(u) - e) / (1 - e * Math.cos(u));
    const sin_f = (Math.sqrt(1 - e * e) * Math.sin(u)) / (1 - e * Math.cos(u));
    const r = (a * (1 - e * e)) / (1 + e * cos_f);

    const originalPosition = new THREE.Vector3();

    originalPosition.x = r * cos_f;
    originalPosition.z = r * sin_f;

    return originalPosition;
}

export function Planet({
    children,
    ignoreHover = false,
    position,
    moveDelta = [0, 0, 0],
    moveFunc = defaultPlanetMove,
    rotationDelta = [0, 0, 0],
    dimensions = [0.7, 32, 32],
    ...props
}: PlanetProps) {
    // This reference gives us direct access to the THREE.Mesh object
    const ref = createRef<THREE.Mesh>();
    const refTime = useRef<number>(0);
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false);
    const [clicked, click] = useState(false);

    const [center, setCenter] = useState<THREE.Vector3>(asV3(position));
    const rotDelta = useMemo(() => asV3(rotationDelta), [rotationDelta]);
    const movDelta = useMemo(() => asV3(moveDelta), [moveDelta]);

    useFrame((_state, _delta) => {
        if (!ref.current) {
            return;
        }
        ref.current.rotation.x += rotDelta.x;
        ref.current.rotation.y += rotDelta.y;
        ref.current.rotation.z += rotDelta.z;

        const nextPosition = moveFunc
            ? moveFunc(props, _delta, refTime.current, ref.current.position)
            : new THREE.Vector3(
                  Math.sin(refTime.current) * _delta,
                  0,
                  Math.cos(refTime.current) * _delta
              );

        nextPosition.add(center);
        ref.current.position.copy(nextPosition);

        // setCenter(nextPosition);

        refTime.current += _delta;
    });

    // Return the view, these are regular Threejs elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={ref}
            scale={clicked || hovered ? 5 : 1}
            onClick={(event) => (!ignoreHover ? click(!clicked) : undefined)}
            onPointerOver={(event) => (!ignoreHover ? hover(true) : undefined)}
            onPointerOut={(event) => (!ignoreHover ? hover(false) : undefined)} // 1 <= 2
            position={center}
        >
            <sphereGeometry args={dimensions} />
            {/* When passed children, will be added to meshs children */}
            {children}
        </mesh>
    );
}
