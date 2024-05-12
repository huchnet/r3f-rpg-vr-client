
import { Html, useAnimations, useGLTF, Text } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { SkeletonUtils } from "three-stdlib";

import { useThree } from "@react-three/fiber";
import { Vector3 } from "three";








export function Avatar({
    weapon = "1H_Sword",
    id,
    avatarUrl = "/models/Knight.glb",
    ...props
}) {
    //console.log("Avatar at the: " + mapId)
    const group = useRef();
    //!!!clarify useMemo
    const position = useMemo(() => props.position, []);




    const { scene, materials, animations } = useGLTF(avatarUrl);
    // Skinned meshes cannot be re-used in threejs without cloning them
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    // useGraph creates two flat object collections for nodes and materials
    const { nodes } = useGraph(clone);
    const { actions } = useAnimations(animations, group);
    const [animation, setAnimation] = useState("Idle");


    useEffect(() => {
        actions[animation].reset().fadeIn(0.32).play();
        return () => actions[animation]?.fadeOut(0.32);
    }, [animation]);
    //Set the model preferences


    //This is just a conversion from grid to Vector











    useFrame((state, delta) => {

        setAnimation("Idle");


    });

    return (
        <>
            <group
                ref={group}
                {...props}
                position={position}
                name={`character-${id}`}

                scale={[0.5, 0.5, 0.5]}

            >
                {/* <Html position-y={2.5 + props.fly + (path?.length ? elevation : 0)}> */}

                {/* <Html position-y={2.5 + props.fly + elevation}> */}

                <group name="Scene">

                    {/*</group><group name="Scene" position-y={props.fly + (pathY?.length ? elevation : 0) + (props.fly > 0 ? -2 * elevation : 0)} rotation={[flyingRotation, 0, 0]}>*/}
                    <group name="Rig">
                        <primitive object={nodes.root} />
                        <skinnedMesh name="Knight_ArmLeft" geometry={nodes.Knight_ArmLeft.geometry} material={materials.knight_texture} skeleton={nodes.Knight_ArmLeft.skeleton} />
                        <skinnedMesh name="Knight_ArmRight" geometry={nodes.Knight_ArmRight.geometry} material={materials.knight_texture} skeleton={nodes.Knight_ArmRight.skeleton} />
                        <skinnedMesh name="Knight_Body" geometry={nodes.Knight_Body.geometry} material={materials.knight_texture} skeleton={nodes.Knight_Body.skeleton} />
                        <skinnedMesh name="Knight_Head" geometry={nodes.Knight_Head.geometry} material={materials.knight_texture} skeleton={nodes.Knight_Head.skeleton} />
                        <skinnedMesh name="Knight_LegLeft" geometry={nodes.Knight_LegLeft.geometry} material={materials.knight_texture} skeleton={nodes.Knight_LegLeft.skeleton} />
                        <skinnedMesh name="Knight_LegRight" geometry={nodes.Knight_LegRight.geometry} material={materials.knight_texture} skeleton={nodes.Knight_LegRight.skeleton} />
                    </group>
                </group>
                {props.fly > 0 && (
                    <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <circleGeometry

                            args={[0.7, 30]}
                        />
                        <meshBasicMaterial
                            color={"blue"}
                            opacity={0.15}
                            transparent
                        />
                    </mesh>
                )}
            </group >

        </>



    );
}

useGLTF.preload('/models/Knight.glb')