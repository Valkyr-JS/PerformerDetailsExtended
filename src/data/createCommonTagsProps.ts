import { DetailItemProps } from "../components/DetailItem";

/**
 * Get the most common tags in scenes the performer is featured in. Returns a
 * string formatted as "Tag name A (count), Tag name B (count)..." etc.
 */
const createCommonTagsProps: FnCreateCommonTagsProps = (
  { scenes, tagCount = 3 },
  collapsed
) => {
  // Create an array of tag data from all scenes
  const tags: {
    count: number;
    id: Tag["id"];
    name: Tag["name"];
  }[] = [];

  // Check each scene
  scenes.forEach((sc) => {
    // Check each tag in the scene
    sc.tags.forEach((tag) => {
      // Check if the tag already exists in the array
      const tagIndex = tags.findIndex((t) => t.id === tag.id);

      if (tagIndex !== -1) {
        // Increase the tag count
        tags[tagIndex].count++;
      } else {
        // Add the tag to the array
        tags.push({
          id: tag.id,
          count: 1,
          name: tag.name,
        });
      }
    });
  });

  // Sort count from highest to lowest
  tags.sort((a, b) => b.count - a.count);

  // Return the tags with the highest overall count, up to the tagCount
  if (tags.length) {
    const maxTags = tags.length < tagCount ? tags.length : tagCount;
    let value = "";
    for (let i = 0; i < maxTags; i++) {
      value += (i === 0 ? "" : ", ") + `${tags[i].name} (${tags[i].count})`;
    }
    const props = {
      id: "common-tags",
      collapsed,
      title: `Most Common Tags`,
      value,
      wide: true,
    };
    return props;
  } else {
    return null;
  }
};

export default createCommonTagsProps;

interface IcreateCommonTags {
  scenes: Scene[];
  tagCount: number;
}

type FnCreateCommonTagsProps = (
  args: IcreateCommonTags,
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: boolean
) => DetailItemProps | null;
