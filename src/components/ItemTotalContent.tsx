import { createDuration, createFilesize } from "../helpers";
import DetailItem from "./DetailItem";
const { React } = window.PluginApi;

const ItemTotalContent: React.FC<ItemTotalContentProps> = (props) => {
  const { duration, filesize } = props.scenesQueryResult;

  return (
    <DetailItem
      collapsed={props.collapsed}
      id="total-content"
      title="Total Content"
      value={createDuration(duration)}
      wide={true}
      additionalData={{
        id: "total-filesize",
        value: createFilesize(filesize),
      }}
    />
  );
};

export default ItemTotalContent;

interface ItemTotalContentProps {
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: PropsPerformerDetailsPanelDetailGroup["collapsed"];
  /** The `findScenes` data object returned from the GQL query. */
  scenesQueryResult: FindScenesResultType;
}
