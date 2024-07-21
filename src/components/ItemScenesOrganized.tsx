import type { PropsPerformerDetailsPanelDetailGroup } from "@pluginTypes/stashPlugin";
import DetailItem from "./DetailItem";
const { React } = window.PluginApi;

const ItemScenesOrganized: React.FC<ItemScenesOrganizedProps> = (props) => {
  const { scenes } = props.scenesQueryResult;
  const totalScenes = scenes.length;

  if (totalScenes < 1) return null;

  const organizedScenes = scenes.filter((sc) => sc.organized).length;

  const percentage = Math.round(
    (organizedScenes / totalScenes + Number.EPSILON) * 100
  );

  // Only show the additional data if it is more than 0
  const additionalData = organizedScenes
    ? {
        id: "scenes-organized-number",
        dataValue: percentage,
        value: percentage + "%" + " of " + totalScenes,
      }
    : undefined;

  return (
    <DetailItem
      collapsed={props.collapsed}
      dataValue={organizedScenes}
      id="scenes-organized"
      title="Scenes Organized"
      value={organizedScenes}
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
