import initDetailItem from "./DetailItem";
import type { DetailItemProps } from "./DetailItem";

const setupDetailGroup = (React: typeof globalThis.React) => {
  const DetailItem = initDetailItem(React);

  const DetailGroup = ({ groupID, items }: DetailGroupProps) => {
    return (
      <div id={groupID} className="detail-group">
        {items.map((itemProps) => (
          <DetailItem key={itemProps.id} {...itemProps} />
        ))}
      </div>
    );
  };

  return DetailGroup;
};

export default setupDetailGroup;

export interface DetailGroupProps {
  groupID: string;
  items: DetailItemProps[];
}
