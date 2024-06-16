import { createDuration } from "../../helpers";
import DetailItem from "./DetailItem";
const { React } = window.PluginApi;

const ItemContentSize: React.FC<ItemContentSizeProps> = (props) => {
  const { duration, filesize } = props.scenesQueryResult;

  return (
    <DetailItem
      collapsed={props.collapsed}
      id="content-size"
      title="Total Content"
      value={createDuration(duration)}
      wide={false}
      additionalData={{
        id: "content-filesize",
        value: "2.4GB",
      }}
    />
  );
};

export default ItemContentSize;

interface ItemContentSizeProps {
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: PropsPerformerDetailsPanelDetailGroup["collapsed"];
  /** The `findScenes` data object returned from the GQL query. */
  scenesQueryResult: FindScenesResultType;
}
