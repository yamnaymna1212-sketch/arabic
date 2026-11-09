import { Composition, Folder } from "remotion";
import { SEED_PARABLE_SECONDS, SeedParable } from "./SeedParable";
import { EP1_SECONDS, Episode1 } from "./ep1/Episode";
import { FPS } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Episode1-Sanabil"
        component={Episode1}
        durationInFrames={Math.ceil(EP1_SECONDS * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Folder name="Shorts">
        <Composition
          id="SeedParable"
          component={SeedParable}
          durationInFrames={Math.ceil(SEED_PARABLE_SECONDS * FPS)}
          fps={FPS}
          width={1080}
          height={1920}
        />
      </Folder>
    </>
  );
};
