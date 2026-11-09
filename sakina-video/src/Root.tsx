import { Composition, Folder, Still } from "remotion";
import { ThumbnailA, ThumbnailB } from "./ep1/Thumbnail";
import { Banner, Logo, LogoWithName } from "./ep1/Brand";
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
      <Folder name="Brand">
        <Still id="Logo" component={Logo} width={800} height={800} />
        <Still id="Logo-WithName" component={LogoWithName} width={1080} height={1080} />
        <Still id="Banner" component={Banner} width={2560} height={1440} />
      </Folder>
      <Folder name="Thumbnails">
        <Still id="Thumb-A" component={ThumbnailA} width={1280} height={720} />
        <Still id="Thumb-B" component={ThumbnailB} width={1280} height={720} />
      </Folder>
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
