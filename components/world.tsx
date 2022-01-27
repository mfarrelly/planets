import { Canvas } from "@react-three/fiber";
import React from "react";
import { Planet } from "./planet";

export function World() {
    return (
        <Canvas>
            <ambientLight color={"green"} />
            <pointLight position={[0, 10, 10]} color="red" />
            <Planet position={[-1.2, 0, 0]} />
            <Planet position={[1.2, 0, 0]} />
        </Canvas>
    );
}
