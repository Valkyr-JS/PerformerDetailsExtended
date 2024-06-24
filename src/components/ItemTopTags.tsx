import DetailItem from "./DetailItem";
import TagItem from "./TagItem";
const { React } = window.PluginApi;

const ItemTopTags: React.FC<ItemTopTagsProps> = ({ performer, ...props }) => {
  const { topTagsBlacklist, topTagsCount, topTagsOn } = props.pluginConfig;

  // Do not render the item if the user has turned it off in the config.
  if (!topTagsOn) return null;

  // Create blacklist array
  const blacklist = topTagsBlacklist.split(",").map((tag) => tag.trim());

  // Create an array of tag data from all scenes
  const tags: {
    count: number;
    data: Tag;
  }[] = [];

  // Check each scene
  props.scenesQueryResult.scenes.forEach((sc) => {
    // Check each tag in the scene
    sc.tags.forEach((tag) => {
      // Check if the tag is in the blacklist. If so, skip it.
      if (blacklist.findIndex((t) => t === tag.name.trim()) !== -1) return;

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
  const maxTags = tags.length < topTagsCount ? tags.length : topTagsCount;

  const value = [];
  for (let i = 0; i < maxTags; i++) {
    const tagCount = tags[i].count;
    const tagData = tags[i].data;

    const link = `/scenes?c=("type":"performers","value":("items":%5B("id":"${
      performer.id
    }","label":"${encodeURIComponent(
      performer.name
    )}")%5D,"excluded":%5B%5D),"modifier":"INCLUDES")&c=("type":"tags","value":("items":%5B("id":"${
      tagData.id
    }","label":"${encodeURIComponent(
      tagData.name
    )}")%5D,"excluded":%5B%5D,"depth":0),"modifier":"INCLUDES")`;

    value.push(
      <TagItem
        link={link}
        title={`${tagData.name} (${tagCount} ${
          tagCount === 1 ? "scene" : "scenes"
        })`}
      />
    );
  }

  const title = "Top Tag" + (topTagsCount === 1 ? "" : "s");

  return (
    <DetailItem
      collapsed={props.collapsed}
      id="top-tags"
      title={title}
      value={value}
      wide={true}
    />
  );
};

export default ItemTopTags;

interface ItemTopTagsProps {
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: PropsPerformerDetailsPanelDetailGroup["collapsed"];
  /** The current Stash performer. */
  performer: Performer;
  /** The plugin config data. */
  pluginConfig: PDEFinalConfigMap;
  /** The `findScenes` data object returned from the GQL query. */
  scenesQueryResult: FindScenesResultType;
}
