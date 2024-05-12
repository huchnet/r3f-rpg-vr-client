
import { Canvas } from '@react-three/fiber'

import { Scene } from './components/Scene'
import { XR, VRButton, Controllers, TeleportationPlane, toggleSession, useXR } from '@react-three/xr'
import { OrbitControls, KeyboardControls } from '@react-three/drei'
import { Suspense, useMemo } from "react";
import { UI } from "./components/UI";
import { SocketManager } from "./components/SocketManager";

import { useAtom } from "jotai";



export const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  attack: "attack",
  hold: "hold",
  c: "c",
  f: "f"
}


function App() {

  const keyMap = useMemo(() => [
    { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
    { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
    { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
    { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
    { name: Controls.hold, keys: ["KeyH", "KeyH"] },
    { name: Controls.c, keys: ["KeyC", "KeyC"] },
    { name: Controls.c, keys: ["KeyF", "KeyF"] },
    { name: Controls.attack, keys: ["Space"] },
  ], [])



  return (
    <>
      <SocketManager />
      <KeyboardControls map={keyMap} />
      <VRButton />
      {/* <button
        onClick={async () => {
          var session = await toggleSession('immersive-vr')

          setVRSession(!vrSession)
          console.log(session)

        }}>
        ENTER VR
      </button> */}
      <Canvas>
        <XR>
          <OrbitControls />
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
          <Controllers />
          {/* <TeleportationPlane leftHand={false} rightHand={false} maxDistance={100} size={0.25} /> */}
        </XR>
      </Canvas>
      <UI />
    </>

  )
}

export default App