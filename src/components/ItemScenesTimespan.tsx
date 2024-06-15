import DetailItem from "./DetailItem";
const { React } = window.PluginApi;

const ItemScenesTimespan: React.FC<ItemScenesTimespanProps> = ({
  collapsed,
  scenesQueryResult,
}) => {
  const { scenes } = scenesQueryResult;

  // Filter out scenes with no date
  const datedScenes = scenes.filter((sc) => typeof sc.date !== "undefined");

  // Require a minimum of two scenes to display this item.
  if (datedScenes.length < 2) return null;

  const earliestScene = datedScenes[0];
  const latestScene = datedScenes[datedScenes.length - 1];

  return (
    <DetailItem
      collapsed={collapsed}
      id="library-timespan"
      title="Library Timespan"
      value={earliestScene.date + " – " + latestScene.date}
      wide={true}
    />
  );
};

export default ItemScenesTimespan;

interface ItemScenesTimespanProps {
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: PropsPerformerDetailsPanelDetailGroup["collapsed"];
  /** The `findScenes` data object returned from the GQL query. */
  scenesQueryResult: FindScenesResultType;
}
