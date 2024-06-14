import { createDuration } from "../../helpers";
import DetailItem from "./DetailItem";
const { GQL, React } = window.PluginApi;

/** "Scene Play Count" item component. */
const ItemPlayCount: React.FunctionComponent<ItemPlayCountProps> = (props) => {
  const query = GQL.useFindScenesQuery({
    variables: {
      filter: { per_page: -1, sort: "date" },
      scene_filter: {
        performers: {
          modifier: CriterionModifier.Includes,
          value: props.performerIDs,
        },
      },
    },
  });

  let playCount = 0;
  let playDuration = 0;

  if (!!query.data.findScenes && !!query.data.findScenes.scenes)
    for (const scene of query.data.findScenes.scenes) {
      playCount += scene?.play_count || 0;
      playDuration += scene.play_duration || 0;
    }

  return (
    <DetailItem
      collapsed={props.collapsed}
      id="play-count"
      title="Scene Play Count"
      value={
        <>
          {playCount} {playCount === 1 ? "time" : "times"}
          <span className="additional-data total-play-time">
            {createDuration(playDuration)} total
          </span>
        </>
      }
      wide={true}
    />
  );
};

export default ItemPlayCount;

interface ItemPlayCountProps {
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: PropsPerformerDetailsPanelDetailGroup["collapsed"];
  performerIDs: Performer["id"][];
}
