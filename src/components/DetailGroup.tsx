const setupDetailGroup = (React: typeof globalThis.React) => {
  const DetailGroup = ({ groupID, items }: DetailGroupProps) => {
    return (
      <div id={groupID} className="detail-group">
        {items.map((itemProps) => (
          <DetailItem key={itemProps.id} {...itemProps} />
        ))}
      </div>
    );
  };

  const DetailItem = ({ id, isCollapsed, title, value }: DetailItemProps) => {
    const titleText = !isCollapsed ? title + ":" : title;
    return (
      <div className={"detail-item " + id}>
        <span className={"detail-item-title " + id}>{titleText}</span>
        <span className={"detail-item-value " + id}>{value}</span>
      </div>
    );
  };

  return DetailGroup;
};

export default setupDetailGroup;

interface DetailGroupProps {
  groupID: string;
  items: DetailItemProps[];
}

interface DetailItemProps {
  id: string;
  isCollapsed: boolean;
  title: string;
  value: React.ReactNode;
}
