import initDetailItem from "./DetailItem";
import type { DetailItemProps } from "./DetailItem";

/** Initialises the DetailGroup component by passing React as an argument. */
const initDetailGroup: initComponent<DetailGroupProps> = (React) => {
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

export default initDetailGroup;

export interface DetailGroupProps {
  groupID: string;
  items: DetailItemProps[];
}
