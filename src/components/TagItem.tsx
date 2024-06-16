const { React } = window.PluginApi;

/** A custom tag item component designed to look like the native component, but
 * with more customisation options. */
const TagItem: React.FC<TagItemProps> = (props) => {
  /**
   * ! Awaiting `TagCard` component to be made available in order to add the
   * hover popover. See
   * https://github.com/stashapp/stash/issues/4510#issuecomment-2171511553
   */
  return (
    <span className="tag-item badge badge-secondary">
      <a href={props.link}>{props.title}</a>
    </span>
  );
};

export default TagItem;

interface TagItemProps {
  link: string;
  title: string;
}
