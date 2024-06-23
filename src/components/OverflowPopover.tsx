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
    <ul
      style={{
        listStyle: "none",
        padding: "0.5rem 1rem",
        marginBottom: 0,
        textAlign: "left",
      }}
    >
      {props.items.map((item, i) =>
        i < props.overflowAt ? null : (
          <li>
            {typeof item.link !== "undefined" ? (
              <a href={item.link}>{item.content}</a>
            ) : (
              item.content
            )}
          </li>
        )
      )}
    </ul>
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

interface OverflowPopoverProps extends React.PropsWithChildren {
  overflowAt: number;
  items: {
    content: React.ReactNode;
    link?: string;
  }[];
}
