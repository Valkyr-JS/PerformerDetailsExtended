import { createDuration } from "../helpers";
import DetailItem from "./DetailItem";
const { React } = window.PluginApi;

/** "Total Play Duration" item component. */
const ItemTotalPlayDuration: React.FC<ItemTotalPlayDurationProps> = ({
  collapsed,
  scenesQueryResult,
}) => {
  let playCount = 0;
  let playDuration = 0;

  for (const scene of scenesQueryResult.scenes) {
    playCount += scene?.play_count || 0;
    playDuration += scene.play_duration || 0;
  }

  if (playDuration === 0) return null;

  // Only show the additional data if it is more than 0
  const additionalData = playCount
    ? {
        id: "total-play-count",
        value: `${playCount} ${playCount === 1 ? "play" : "plays"}`,
      }
    : undefined;

  return (
    <DetailItem
      collapsed={collapsed}
      id="total-play-duration"
      title="Total Play Duration"
      value={createDuration(playDuration)}
      wide={true}
      additionalData={additionalData}
    />
  );
};

export default ItemTotalPlayDuration;

interface ItemTotalPlayDurationProps {
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: PropsPerformerDetailsPanelDetailGroup["collapsed"];
  /** The `findScenes` data object returned from the GQL query. */
  scenesQueryResult: FindScenesResultType;
}
