import { createDuration } from "../helpers";
import DetailItem from "./DetailItem";
const { React } = window.PluginApi;

/** "Total Play Duration" item component. */
const ItemTotalPlayDuration: React.FC<ItemTotalPlayDurationProps> = ({
  collapsed,
  scenesQueryResult,
  ...props
}) => {
  const { totalPlayCountOn } = props.pluginConfig;
  const { total_play_duration } = props.statsQueryResult;
  let playCount = 0;
  let playDuration = 0;

  for (const scene of scenesQueryResult.scenes) {
    playCount += scene?.play_count || 0;
    playDuration += scene.play_duration || 0;
  }

  if (playDuration === 0) return null;

  // Create additional duration data for use if Total Play Count is switched on.
  const percentage =
    Math.round((playDuration / total_play_duration + Number.EPSILON) * 10000) /
    100;
  const additionalDurationData = {
    id: "duration-percentage",
    value: `${percentage}% of ${createDuration(total_play_duration)}`,
  };

  // Only show the additional duration data if it is more than 0
  const additionalCountData = playCount
    ? {
        dataValue: playCount,
        id: "total-play-count",
        value: `${playCount} ${playCount === 1 ? "play" : "plays"}`,
      }
    : undefined;

  // If the Total Play Count item is displayed, show the additional duration
  // data here. Otherwise display limited count data.
  const additionalData = totalPlayCountOn
    ? additionalDurationData
    : additionalCountData;
  return (
    <DetailItem
      collapsed={collapsed}
      dataValue={playDuration}
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
  /** The plugin config data. */
  pluginConfig: PDEFinalConfigMap;
  /** The `findScenes` data object returned from the GQL query. */
  scenesQueryResult: FindScenesResultType;
  /** The `stats` data object returned from the GQL query. */
  statsQueryResult: StatsResultType;
}
