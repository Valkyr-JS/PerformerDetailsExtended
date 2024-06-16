import { createDuration } from "../../helpers";
import DetailItem from "./DetailItem";
const { React } = window.PluginApi;

/** "Scene Play Count" item component. */
const ItemPlayCount: React.FC<ItemPlayCountProps> = ({
  collapsed,
  scenesQueryResult,
}) => {
  let playCount = 0;
  let playDuration = 0;

  for (const scene of scenesQueryResult.scenes) {
    playCount += scene?.play_count || 0;
    playDuration += scene.play_duration || 0;
  }

  return (
    <DetailItem
      collapsed={collapsed}
      id="play-time"
      title="Scenes Watch For"
      value={createDuration(playDuration)}
      wide={true}
      additionalData={{
        id: "total-play-count",
        value: `${playCount} ${playCount === 1 ? "play" : "plays"}`,
      }}
    />
  );
};

export default ItemPlayCount;

interface ItemPlayCountProps {
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: PropsPerformerDetailsPanelDetailGroup["collapsed"];
  /** The `findScenes` data object returned from the GQL query. */
  scenesQueryResult: FindScenesResultType;
}