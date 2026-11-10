import { Composition, Folder, Still } from "remotion";
import { EP1_SECONDS, Episode1 } from "./Episode";
import { FPS } from "./lib";
import { ThumbA, ThumbB } from "./Thumbnail";
import { Banner, Logo } from "./Brand";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Ep1-CarLoan"
      component={Episode1}
      durationInFrames={Math.ceil(EP1_SECONDS * FPS)}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Folder name="Thumbnails">
      <Still id="Thumb-A" component={ThumbA} width={1280} height={720} />
      <Still id="Thumb-B" component={ThumbB} width={1280} height={720} />
    </Folder>
    <Folder name="Brand">
      <Still id="Logo" component={Logo} width={800} height={800} />
      <Still id="Banner" component={Banner} width={2560} height={1440} />
    </Folder>
  </>
);
