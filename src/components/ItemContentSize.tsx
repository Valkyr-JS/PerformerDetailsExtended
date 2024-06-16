import DetailItem from "./DetailItem";
const { React } = window.PluginApi;

const ItemContentSize: React.FC<ItemContentSizeProps> = (props) => {
  return (
    <DetailItem
      collapsed={props.collapsed}
      id="content-size"
      title="Total Content Size"
      value="1h 2m 3s"
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
