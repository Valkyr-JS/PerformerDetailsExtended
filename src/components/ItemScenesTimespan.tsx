import type { PropsPerformerDetailsPanelDetailGroup } from "@pluginTypes/stashPlugin";
import DetailItem from "./DetailItem";
const { PluginApi } = window;
const { React } = PluginApi;

const ItemScenesTimespan: React.FC<ItemScenesTimespanProps> = (props) => {
  const { scenesTimespanReverse } = props.pluginConfig;
  // Wait for PluginApi components to load before rendering.
  const componentsLoading = PluginApi.hooks.useLoadComponents([
    PluginApi.loadableComponents.SceneCard,
  ]);

  if (componentsLoading) return null;
  const { HoverPopover, SceneCard } = PluginApi.components;

  // Filter out scenes with no date
  const { scenes } = props.scenesQueryResult;
  const datedScenes = scenes.filter(({ date }) => !!date);

  // Require a minimum of two scenes to render this item.
  if (datedScenes.length < 2) return null;

  const earliestScene = datedScenes[0];
  const latestScene = datedScenes[datedScenes.length - 1];

  const firstScene = scenesTimespanReverse ? latestScene : earliestScene;
  const secondScene = scenesTimespanReverse ? earliestScene : latestScene;

  return (
    <DetailItem
      collapsed={props.collapsed}
      id="scenes-timespan"
      title="Scenes Timespan"
      value={
        <div className="inner-wrapper">
          <HoverPopover
            placement="bottom"
            content={<SceneCard scene={firstScene} compact={true} />}
            leaveDelay={100}
          >
            <span className="hoverable">
              {firstScene.date?.split("-").join("/")}
            </span>
          </HoverPopover>
          <span className="separator">–</span>
          <HoverPopover
            placement="bottom"
            content={<SceneCard scene={secondScene} compact={true} />}
            leaveDelay={100}
          >
            <span className="hoverable">
              {secondScene.date?.split("-").join("/")}
            </span>
          </HoverPopover>
        </div>
      }
      wide={true}
    />
  );
};

export default ItemScenesTimespan;

interface ItemScenesTimespanProps {
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: PropsPerformerDetailsPanelDetailGroup["collapsed"];
  /** The plugin config data. */
  pluginConfig: PDEFinalConfigMap;
  /** The `findScenes` data object returned from the GQL query. */
  scenesQueryResult: FindScenesResultType;
}
