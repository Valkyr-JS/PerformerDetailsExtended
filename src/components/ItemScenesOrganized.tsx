import DetailItem from "./DetailItem";
const { React } = window.PluginApi;

const ItemScenesOrganized: React.FC<ItemScenesOrganizedProps> = (props) => {
  const { scenes } = props.scenesQueryResult;
  const totalScenes = scenes.length;

  if (totalScenes < 1) return null;

  const organizedScenes = scenes.filter((sc) => sc.organized).length;

  return (
    <DetailItem
      collapsed={props.collapsed}
      id="scenes-organized"
      title="Scenes Organized"
      value={
        Math.round((organizedScenes / totalScenes + Number.EPSILON) * 100) + "%"
      }
      wide={true}
      additionalData={{
        id: "scenes-organized-number",
        value: organizedScenes + "/" + totalScenes,
      }}
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
