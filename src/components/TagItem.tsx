const { React } = window.PluginApi;

/** A custom tag item component designed to look like the native component, but
 * with more customisation options. */
const TagItem: React.FC<TagItemProps> = (props) => {
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
