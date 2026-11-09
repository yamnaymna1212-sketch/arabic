import { Composition } from "remotion";
import { SEED_PARABLE_SECONDS, SeedParable } from "./SeedParable";
import { FPS } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SeedParable"
      component={SeedParable}
      durationInFrames={Math.ceil(SEED_PARABLE_SECONDS * FPS)}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
