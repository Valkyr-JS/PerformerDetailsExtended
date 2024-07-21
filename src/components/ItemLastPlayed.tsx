import type { PropsPerformerDetailsPanelDetailGroup } from "@pluginTypes/stashPlugin";
import DetailItem from "./DetailItem";
const { React } = window.PluginApi;

const ItemLastPlayed: React.FC<ItemLastPlayedProps> = (props) => {
  /**
   * ! Cannot be implemented until `play_history` is made available in queries.
   * Have raised at
   * https://github.com/stashapp/stash/issues/4510#issuecomment-2171652436
   */
  const { scenes } = props.scenesQueryResult;
  const playedScenes = scenes.filter(
    (sc) => typeof sc.play_history !== "undefined"
  );

  // Only return the component if there is at least one played scene
  if (!playedScenes.length) return null;

  const recentlyPlayedScene = playedScenes.sort((a, b) => {
    return Number(a.play_history[0]) - Number(b.play_history[0]);
  })[0];

  return (
    <DetailItem
      collapsed={props.collapsed}
      id="last-played"
      title="Last Played"
      value={
        <span className="hoverable">
          {recentlyPlayedScene.date?.split("-").join("/")}
        </span>
      }
      wide={true}
    />
  );
};

export default ItemLastPlayed;

interface ItemLastPlayedProps {
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: PropsPerformerDetailsPanelDetailGroup["collapsed"];
  /** The `findScenes` data object returned from the GQL query. */
  scenesQueryResult: FindScenesResultType;
}
