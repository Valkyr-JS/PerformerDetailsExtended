/** Initialises the DetailItem component by passing React as an argument. */
const initDetailItem: initComponent<DetailItemProps> = (React) => {
  const DetailItem = ({ id, isCollapsed, title, value }: DetailItemProps) => {
    const titleText = !isCollapsed ? title + ":" : title;
    return (
      <div className={"detail-item " + id}>
        <span className={"detail-item-title " + id}>{titleText}</span>
        <span className={"detail-item-value " + id}>{value}</span>
      </div>
    );
  };

  return DetailItem;
};

export default initDetailItem;

export interface DetailItemProps {
  id: string;
  isCollapsed: boolean;
  title: string;
  value: React.ReactNode;
}
