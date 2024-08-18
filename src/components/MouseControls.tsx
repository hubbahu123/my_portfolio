import { MathUtils } from "three";
import { useFrame } from "@react-three/fiber";

const MouseControls = () => {
  useFrame(({ camera, pointer }, delta) => {
    camera.rotation.x = MathUtils.damp(
      camera.rotation.x,
      pointer.y * Math.PI * 0.05,
      6,
      delta,
    );
    camera.rotation.y = MathUtils.damp(
      camera.rotation.y,
      pointer.x * Math.PI * -0.05,
      6,
      delta,
    );
  });

  return null;
};

export default MouseControls;
