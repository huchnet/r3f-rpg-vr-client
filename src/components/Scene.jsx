import { Environment, OrbitControls, CameraControls } from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from "@react-three/fiber";
import { Character } from './Character'
import { Item } from "./Item";
import { useAtom } from "jotai";
import { mapAtom, charactersAtom, userAtom } from "./SocketManager";
import { useGrid } from '../hooks/useGrid'
import { cameraFixAtom, teleportPositionAtom, cameraDistanceAtom } from './Global'
//import { Vector3 } from 'three';
import { Interactive, useTeleportation, useXR, useXREvent } from '@react-three/xr'
//import { useController  } from '@react-three/xr'






export const Scene = () => {

    //const [hover, setHover] = useState(false)
    const [color, setColor] = useState(0x123456)
    const [cameraFix, setCameraFix] = useAtom(cameraFixAtom);
    const [teleportPosition, setTeleportPosition] = useAtom(teleportPositionAtom);
    const [cameraDistance, setCameraDistance] = useAtom(cameraDistanceAtom);
    const { vector3ToGrid3DV3, grid3DToVector3V3 } = useGrid();
    const cameraControls = useRef();
    const [map] = useAtom(mapAtom);
    const [characters] = useAtom(charactersAtom);
    const [user] = useAtom(userAtom)
    const scene = useThree((state) => state.scene)
    const character = scene.getObjectByName(`character-${user}`);
    const teleport = useTeleportation()
    const [cameraTeleport, setCameraTeleport] = useState([0, 1, 5])
    const playerHeadSet = useXR((state) => state.player)

    const [leftPosition, setLeftPosition] = useState()

    useXREvent('select', (event) => console.log("select event work on Oculus"))
    // useXREvent('selectstart', (event) => console.log("selectstart event"))
    // useXREvent('selectend', (event) => console.log("selectend event"))
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
    useXREvent('squeeze', (event) => {
        console.log("right squeeze works on Oculus")
        setCameraDistance([cameraDistance[0] + 1, cameraDistance[1] + 2])
        const positionAux = vector3ToGrid3DV3(character?.position)
        //setTeleportPosition([positionAux[0], (positionAux[2] + 3), (positionAux[1] + 7)])
        setTeleportPosition([(positionAux[0] / 2), ((positionAux[2] / 2) + cameraDistance[0]), (positionAux[1] / 2) + cameraDistance[1]])

    }, { handedness: 'right' })

    useXREvent('squeeze', (event) => {
        console.log("left squeeze works on Oculus")
        setCameraDistance([cameraDistance[0] - 1, cameraDistance[1] - 2])
        // const characterScene = scene.getObjectByName(`character-${user}`)
        // vector3ToGrid3DV3(characterScene.position)
        // console.log(characterScene.position)
        const positionAux = vector3ToGrid3DV3(character?.position)
        //console.log(positionAux)
        //console.log(positionAux)
        //setTeleportPosition([5, 5, 8])
        setTeleportPosition([(positionAux[0] / 2), ((positionAux[2] / 2) + cameraDistance[0]), (positionAux[1] / 2) + cameraDistance[1]])
        //setTeleportPosition(100, 100, 7)

        //console.log([positionAux[0], (positionAux[2] + 3), (positionAux[1] + 3)])

    }, { handedness: 'left' })

    const onSelect = (e) => {
        setColor((Math.random() * 0xffffff) | 0)
        console.log("Interface Selected")
        // console.log(leftController.buttons)
        // console.log("Right buttons")
        // console.log(rightController.buttons)
        console.log(controllers[0]?.inputSource.gamepad.buttons)
        //if(cameraTeleport[0])
        //setCameraTeleport([cameraTeleport[0], cameraTeleport[1], cameraTeleport[2] + 1])
        console.log(e)

    }
    // const leftController = useController('left')
    // const rightController = useController('right')
    // leftController.name = "left"
    // rightController.name = "right"
    const {
        // An array of connected `XRController`
        controllers,
        // Whether the XR device is presenting in an XR session
        isPresenting,
        // Whether hand tracking inputs are active
        isHandTracking,
        // A THREE.Group representing the XR viewer or player
        player,
        // The active `XRSession`
        session,
        // `XRSession` foveation. This can be configured as `foveation` on <XR>. Default is `0`
        foveation,
        // `XRSession` reference-space type. This can be configured as `referenceSpace` on <XR>. Default is `local-floor`
        referenceSpace
    } = useXR()

    // useEffect(() => {
    //     if (controllers.length > 0) {

    //         controllers[0].name = "right"
    //         controllers[1].name = "left"
    //     }
    // }, [controllers])


    //console.log(controllers[0]?.inputSource.gamepad.buttons)
    // console.log(isPresenting)
    // console.log(session)
    // console.log(referenceSpace)
    // console.log(leftController)
    // console.log(rightController)


    function Floor() {
        return (
            // <Interactive key={`1floor}`} onSelect={onSelect} onHover={() => setHover(true)} onBlur={() => setHover(false)}>
            <Interactive key={`1floor}`} onSelect={onSelect}>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[40, 40]} />
                    <meshStandardMaterial color={color} />
                </mesh>
            </Interactive>
        )
    }


    // useEffect(() => {
    //     teleport(cameraTeleport)
    // }, [cameraTeleport])
    useFrame((_state, delta, frame) => {
        //console.log(squeeze)
        if (frame) {
            if (teleportPosition) {
                teleport(teleportPosition)
            } else {
                teleport([100, 100, 5])
            }

            //teleport(cameraTeleport)
            //console.log(controllers[0]?.inputSource.gamepad.buttons)
            //teleport([2, 2, 2])
            if (cameraFix) {
                teleport(cameraTeleport)
                //teleport(new Vector3(10, 10, 2))
                setCameraFix(false)

            }
            //console.log(frame)
            //teleport([10, 10, 2])
            //teleport(new Vector3(10, 10, 2))
        }
        // else {
        //     if (character != undefined) {
        //         cameraControls.current.setPosition(
        //             character.position.x + 3,
        //             character.position.y + 4,
        //             character.position.z + 3,
        //             true
        //         );
        //     }
        // }

        // if (cameraFix) {
        //     cameraControls.current.setPosition(
        //         character.position.x + 3,
        //         character.position.y + 4,
        //         character.position.z + 3,
        //         true
        //     );


        // }

    })
    // map.items.map((item, idx) => {

    //     console.log(item.name)

    // })
    useEffect(() => {
        //console.log(grid3DToVector3V3(characters[0].position))

        // console.log("Set camera")
        // const character = scene.getObjectByName(`character-${user}`);
        if (character != undefined) {
            cameraControls.current.setPosition(
                character.position.x + 3,
                character.position.y + 4,
                character.position.z + 3,
                true
            );
        }
    }, [])

    // useEffect(() => {
    //     console.log(controllers[0]?.inputSource.gamepad.buttons)
    // }, [controllers[0]])



    return (
        <>

            <Environment preset="sunset" />
            <ambientLight intensity={0.3} />
            {/* <Floor /> */}
            < fog attach="fog" color="black" near={1} far={20} />
            <CameraControls
                infinityDolly={false}
                maxDistance={7}
                minDistance={7}
                maxPolarAngle={Math.PI / 4}
                minPolarAngle={Math.PI / 4}
                // minAzimuthAngle={Math.PI}
                // azimuthAngle={Math.PI * 4}
                ref={cameraControls}

                // disable all mouse buttons
                mouseButtons={{
                    left: 0,
                    middle: 0,
                    right: 1,
                    wheel: 0,
                }}
                // disable all touch gestures
                touches={{
                    one: 0,
                    two: 0,
                    three: 0,
                }}
            />

            {
                map?.items.map((item, idx) => (
                    <Item key={`${item.name}-${idx}`} item={item} />
                    //console.log(item)
                ))
            }

            {
                characters.map((character) => (

                    <Character
                        id={character.id}
                        glbUrl="/models/Knight.glb"
                        key={`char-${character.id}`}
                        path={character.path}
                        // position={new Vector3(0, 0, 0)}
                        position={grid3DToVector3V3(character.position)}
                    //charname={character.name}

                    />

                ))
            }
            {/* <Character
                id={"hola2"}
                glbUrl="/models/Knight.glb"
                key={"hola"}//key={`char-${character.id}`}
            /> */}
            <OrbitControls enableZoom={true} ></OrbitControls>
        </>

    )
}

export default Scene