import DetailItem from "./DetailItem";
const { React } = window.PluginApi;

const ItemMostCommonTags: React.FC<ItemMostCommonTagsProps> = ({
  tagCount = 5,
  ...props
}) => {
  // Create an array of tag data from all scenes
  const tags: {
    count: number;
    data: Tag;
  }[] = [];

  // Check each scene
  props.scenesQueryResult.scenes.forEach((sc) => {
    // Check each tag in the scene
    sc.tags.forEach((tag) => {
      // Check if the tag already exists in the array
      const tagIndex = tags.findIndex((t) => t.data.id === tag.id);

      if (tagIndex !== -1) {
        // Increase the tag count
        tags[tagIndex].count++;
      } else {
        // Add the tag to the array
        tags.push({
          count: 1,
          data: tag,
        });
      }
    });
  });

  // Sort count from highest to lowest
  tags.sort((a, b) => b.count - a.count);

  // Return null if there are no tags
  if (!tags.length) return null;

  // Return the tags with the highest overall count, up to the tagCount
  const maxTags = tags.length < tagCount ? tags.length : tagCount;
  let value = "";
  for (let i = 0; i < maxTags; i++) {
    value += (i === 0 ? "" : ", ") + `${tags[i].data.name} (${tags[i].count})`;
  }

  return (
    <DetailItem
      collapsed={props.collapsed}
      id="most-common-tags"
      title="Most Common Tags"
      value={value}
      wide={true}
    />
  );
};

export default ItemMostCommonTags;

interface ItemMostCommonTagsProps {
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: PropsPerformerDetailsPanelDetailGroup["collapsed"];
  /** The `findScenes` data object returned from the GQL query. */
  scenesQueryResult: FindScenesResultType;
  /** The maximum number of tags to display. Default is 3. */
  tagCount?: number;
}
