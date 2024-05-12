
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
export const cameraFixAtom = atom(null);
export const teleportPositionAtom = atom(null);
export const vrSessionAtom = atom(null);
export const Global = () => {

    const [_vrSession, setVRSession] = useAtom(vrSessionAtom);
    const [_teleportPosition, setTeleportPosition] = useAtom(teleportPositionAtom);
    useEffect(() => {
        setCameraFix(true)
        setVRSession(false)
        setTeleportPositionAtom([1, 3, 5])
    }, [])

}
