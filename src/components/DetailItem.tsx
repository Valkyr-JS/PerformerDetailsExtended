/** Initialises and returns the DetailItem component by passing React as an
 * argument. */
const initDetailItem: initComponent<DetailItemProps> = (React) => {
  const DetailItem = ({ id, title, ...props }: DetailItemProps) => {
    const titleText = !props.collapsed ? title + ":" : title;

    const classes = ["detail-item", id];
    if (props.wide) classes.push("detail-item-wide");

    return (
      <div className={classes.join(" ")}>
        <span className={"detail-item-title " + id}>{titleText}</span>
        <span className={"detail-item-value " + id}>
          <span className={"performer-" + id}>{props.value}</span>
        </span>
      </div>
    );
  };

  return DetailItem;
};

export default initDetailItem;

export interface DetailItemProps {
  /** The unique identifier for the item. */
  id: string;
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: PropsPerformerDetailsPanelDetailGroup["collapsed"];
  /** The title of the item as displayed in the UI. */
  title: string;
  /** The value of the item as displayed in the UI. */
  value: React.ReactNode;
  /** Identifies whether to treat the item as including long text that requires
   * more room than native items. */
  wide: boolean;
}
