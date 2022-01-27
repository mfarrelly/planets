import React, { useRef, useState } from "react";
import { MeshProps, useFrame, Vector3 } from "@react-three/fiber";
import * as THREE from "three";

function asV3(input?: Vector3): THREE.Vector3 {
    if (!input) {
        return new THREE.Vector3(0, 0, 0);
    }
    if (input instanceof THREE.Vector3) {
        return input;
    } else if (Array.isArray(input) && input.length === 3) {
        return new THREE.Vector3(input[0], input[1], input[2]);
    } else {
        return new THREE.Vector3(input, input, input);
    }
}

export function Planet({ position, ...props }: MeshProps) {
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef<THREE.Mesh>();
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false);
    const [clicked, click] = useState(false);

    const [center, setCenter] = useState<THREE.Vector3>(asV3(position));

    // Subscribe this component to the render-loop, rotate the mesh every frame

    const refTime = useRef<number>(0);

    useFrame((_state, _delta) => {
        if (!ref.current) {
            return;
        }
        ref.current.rotation.x += 0.01;
        const nextPosition = new THREE.Vector3(
            Math.sin(refTime.current) * _delta,
            Math.sin(refTime.current) * -1 * _delta,
            Math.cos(refTime.current) * _delta
        );
        ref.current.position.copy(center.add(nextPosition));

        refTime.current += _delta;
    });

    // Return the view, these are regular Threejs elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={ref}
            scale={clicked ? 1.5 : 1}
            onClick={(event) => click(!clicked)}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}
            position={center}
        >
            <sphereGeometry args={[0.7, 32, 32]} />
            <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
        </mesh>
    );
}
