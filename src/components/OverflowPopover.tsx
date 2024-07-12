import { default as cx } from "classnames";
const { PluginApi } = window;
const { React } = PluginApi;

const OverflowPopover: React.FC<OverflowPopoverProps> = (props) => {
  // Wait for PluginApi components to load before rendering.
  const componentsLoading = PluginApi.hooks.useLoadComponents([
    PluginApi.loadableComponents.SceneCard,
  ]);

  if (componentsLoading) return null;
  const { HoverPopover } = PluginApi.components;

  const content = (
    <>
      {props.items.map(({ data, link }, i) => {
        const containerClasses = cx("performer-tag-container", "row", {
          // Class added for styling studio tags, which don't exist in native
          // Stash.
          ["studio-tag-container"]: props.type === "studio",
        });

        return i < props.overflowAt ? null : (
          <div className={containerClasses}>
            <a href={link} className="performer-tag col m-auto">
              <img
                className="image-thumbnail"
                alt={data.name ?? ""}
                src={data.image_path ?? ""}
              />
            </a>
            <span className="tag-item d-block badge badge-secondary">
              <a href={link}>
                <span>{data.name}</span>
              </a>
            </span>
          </div>
        );
      })}
    </>
  );

  return (
    <HoverPopover
      className="overflow-popover"
      children={props.children}
      content={content}
      leaveDelay={100}
      placement="bottom"
    ></HoverPopover>
  );
};

export default OverflowPopover;

type OverflowPopoverProps =
  | PerformerOverflowPopoverProps
  | StudioOverflowPopoverProps;

interface StudioOverflowPopoverProps extends React.PropsWithChildren {
  overflowAt: number;
  items: {
    data: Studio;
    link: string;
  }[];
  type: "studio";
}

interface PerformerOverflowPopoverProps extends React.PropsWithChildren {
  overflowAt: number;
  items: {
    data: Performer;
    link: string;
  }[];
  type: "performer";
}
