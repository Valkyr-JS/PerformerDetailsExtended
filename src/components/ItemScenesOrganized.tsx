import DetailItem from "./DetailItem";
const { React } = window.PluginApi;

const ItemScenesOrganized: React.FC<ItemScenesOrganizedProps> = (props) => {
  const { scenes } = props.scenesQueryResult;
  const totalScenes = scenes.length;

  if (totalScenes < 1) return null;

  const organizedScenes = scenes.filter((sc) => sc.organized).length;

  // Only show the additional data if it is more than 0
  const additionalData = organizedScenes
    ? {
        id: "scenes-organized-number",
        value: organizedScenes + " of " + totalScenes,
      }
    : undefined;

  return (
    <DetailItem
      collapsed={props.collapsed}
      id="scenes-organized"
      title="Scenes Organized"
      value={
        Math.round((organizedScenes / totalScenes + Number.EPSILON) * 100) + "%"
      }
      wide={true}
      additionalData={additionalData}
    />
  );
};

export default ItemScenesOrganized;

interface ItemScenesOrganizedProps {
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: PropsPerformerDetailsPanelDetailGroup["collapsed"];
  /** The `findScenes` data object returned from the GQL query. */
  scenesQueryResult: FindScenesResultType;
}
