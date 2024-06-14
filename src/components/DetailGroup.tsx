import DetailItem from "./DetailItem";
import type { DetailItemProps } from "./DetailItem";

const { React } = window.PluginApi;

/** Initialises and returns the DetailGroup component by passing React as an
 * argument. */

const DetailGroup = ({ groupID, items }: DetailGroupProps) => {
  return (
    <div id={groupID} className="detail-group">
      {items.map((itemProps) => (
        <DetailItem key={itemProps.id} {...itemProps} />
      ))}
    </div>
  );
};

export default DetailGroup;

export interface DetailGroupProps {
  groupID: string;
  items: DetailItemProps[];
}
