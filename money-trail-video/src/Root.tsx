import { Composition, Folder, Still } from "remotion";
import { EP1_SECONDS, Episode1 } from "./Episode";
import { FPS } from "./lib";
import { NeonEpisode1 } from "./neon/NeonEpisode";
import { NeonEpisode2 } from "./neon2/Episode2";
import { NeonBanner, NeonLogo, NeonThumbA, NeonThumbB } from "./neon2/Brand2";
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
    <Composition
      id="Ep1-Neon"
      component={NeonEpisode1}
      durationInFrames={Math.ceil(EP1_SECONDS * FPS)}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="Ep1-Neon2"
      component={NeonEpisode2}
      durationInFrames={Math.ceil(EP1_SECONDS * FPS)}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Folder name="Neon-Brand">
      <Still id="Neon-Logo" component={NeonLogo} width={800} height={800} />
      <Still id="Neon-Banner" component={NeonBanner} width={2560} height={1440} />
      <Still id="Neon-Thumb-A" component={NeonThumbA} width={1280} height={720} />
      <Still id="Neon-Thumb-B" component={NeonThumbB} width={1280} height={720} />
    </Folder>
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
