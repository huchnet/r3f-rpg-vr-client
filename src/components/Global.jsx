
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
export const cameraFixAtom = atom(null);
export const teleportPositionAtom = atom(null);
export const cameraDistanceAtom = atom([3, 7]);
export const Global = () => {

    const [cameraDistance, setCameraDistance] = useAtom(cameraDistanceAtom);
    const [_teleportPosition, setTeleportPosition] = useAtom(teleportPositionAtom);
    useEffect(() => {
        setCameraFix(true)
        setCameraDistance([3, 7])
        setTeleportPositionAtom([1, 3, 5])
    }, [])

}
