import type { PropsPerformerDetailsPanelDetailGroup } from "@pluginTypes/stashPlugin";
import DetailItem from "./DetailItem";
const { React } = window.PluginApi;

const ItemOCount: React.FC<ItemOCountProps> = (props) => {
  const { total_o_count } = props.statsQueryResult;

  // Don't return a component if there is no O count across all performers
  if (total_o_count === 0) return null;

  let oCount = 0;

  props.scenesQueryResult.scenes.forEach((sc) => {
    if (typeof sc.o_counter !== "undefined") oCount += sc.o_counter || 0;
  });

  // Don't return a component if there is no O count for this performer
  if (oCount === 0) return null;

  const percentage =
    Math.round((oCount / total_o_count + Number.EPSILON) * 10000) / 100;
  const additionalValue = `${percentage}% of ${total_o_count} total`;

  return (
    <DetailItem
      collapsed={props.collapsed}
      dataValue={oCount}
      id="o-count"
      title="O Count"
      value={oCount}
      wide={true}
      additionalData={{
        id: "o-count-of-total",
        dataValue: percentage,
        value: additionalValue,
      }}
    />
  );
};

export default ItemOCount;

interface ItemOCountProps {
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: PropsPerformerDetailsPanelDetailGroup["collapsed"];
  /** The `findScenes` data object returned from the GQL query. */
  scenesQueryResult: FindScenesResultType;
  /** The `stats` data object returned from the GQL query. */
  statsQueryResult: StatsResultType;
}
