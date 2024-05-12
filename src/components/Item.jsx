import { useGLTF, useCursor } from "@react-three/drei";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { SkeletonUtils } from "three-stdlib";
import { useGrid } from '../hooks/useGrid'
import { mapAtom, charactersAtom, userAtom, socket } from "./SocketManager";
import { useThree } from '@react-three/fiber'
import { Vector3 } from "three";
import { Interactive, useXREvent, useXR } from '@react-three/xr'
import { teleportPositionAtom, cameraDistanceAtom } from './Global'






export const Item = ({ item, ...props }) => {
    const [user] = useAtom(userAtom)
    const { name, gridPosition, size, rotation } = item;
    //console.log(item)
    const mainScene = useThree((state) => state.scene)
    const { scene } = useGLTF(`/models/items/${name}.glb`);
    const { controllers } = useXR()
    const [teleportPosition, setTeleportPosition] = useAtom(teleportPositionAtom);
    const [cameraDistance] = useAtom(cameraDistanceAtom);
    //const { scene } = useGLTF(`/models/items/Crypt.glb`);

    //const [onObject, setOnObject] = useState(false);
    const { vector3ToGrid3DV3, grid3DToVector3V3 } = useGrid();

    // Skinned meshes cannot be re-used in threejs without cloning them
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const width = rotation === 1 || rotation === 3 ? size[1] : size[0];
    const height = rotation === 1 || rotation === 3 ? size[0] : size[1];
    //console.log(grid3DToVector3V3(gridPosition, width, height))
    //console.log(gridPosition)
    // console.log(grid3DToVector3V3([0, 0, 0], width, height))
    // useXREvent('squeezestart', (event) => {
    //     console.log("squeeze start event")
    // })
    // //works
    // useXREvent('select', (event) => console.log("left select event"), { handedness: 'left' })
    // useXREvent('select', (event) => console.log("right select event"), { handedness: 'right' })

    // useXREvent('squeezeend', (event) => {

    //     console.log("squeeze ends event")
    // })
    // //useXREvent('squeezeend', (event) => console.log("squeezeend event"))

    // //works
    // useXREvent('squeeze', (event) => console.log("left squeeze"), { handedness: 'left' })
    // useXREvent('squeeze', (event) => {
    //     console.log("right squeeze")
    //     const characterScene = mainScene.getObjectByName(`character-${user}`)
    //     vector3ToGrid3DV3(characterScene.position)
    //     console.log(characterScene.position)


    // }

    // , { handedness: 'right' })

    const onSelect = (e) => {
        //console.log(e.target.inputSource.handedness)
        //console.log(controllers[0]?.inputSource.handedness)
        //console.log(controllers[0])

        //console.log(e.target)
        if (e.stopPropagation) {
            e.stopPropagation();   // W3C model
        } else {
            e.cancelBubble = true; // IE model
        }
        //console.log(e)
        //console.log(vector3ToGrid3DV3(e.intersection.point))
        if (e.target.inputSource.handedness === "right") {
            //console.log(e.intersection)
            const positionAux = vector3ToGrid3DV3(e.intersection.point)
            //console.log(vector3ToGrid3DV3(e.intersection.point))
            setTeleportPosition([(positionAux[0] / 2), ((positionAux[2] / 2) + cameraDistance[0]), (positionAux[1] / 2) + cameraDistance[1]])
            //console.log([positionAux[0], (positionAux[2] + 1), (positionAux[1] + 5)])

        }
        if (e.target.inputSource.handedness === "left") {
            //console.log("left selected")
            onCharacterMove(e.intersection)
        }
        //onCharacterMove(e.intersection)

    }

    const onCharacterMove = (e) => {
        //console.log("Character Scene")
        //console.log(user)
        const characterScene = mainScene.getObjectByName(`character-${user}`)

        if (!characterScene) return
        //console.log(characterScene)

        //console.log("Origin:" + vector3ToGrid3DV3(characterScene.position, characterScene.mapId))
        //console.log("Target:" + vector3ToGrid3DV3(e.point, characterScene.mapId))
        socket.emit(
            "move3DPath",
            vector3ToGrid3DV3(characterScene.position),
            vector3ToGrid3DV3(e.point)
            //vector3ToGrid(characterScene.position),
            //vector3ToGrid(e.point)
        )
    }

    return (
        <Interactive key={`item-${props.key}`} onSelect={onSelect} >
            <primitive
                key={props.key}
                object={clone}
                position={grid3DToVector3V3(gridPosition, width, height)}
                rotation-y={((rotation || 0) * Math.PI) / 2}
            />
        </Interactive>
    );
};
