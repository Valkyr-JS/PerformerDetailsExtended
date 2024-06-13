import initDetailGroup from "./components/DetailGroup";
import type { DetailItemProps } from "./components/DetailItem";
import { createFrequentPartnerProps, createLibraryCareerProps } from "./data";

(function () {
  const { PluginApi } = window;
  const { GQL, React } = PluginApi;
  const DetailGroup = initDetailGroup(React);

  /* -------------------------------------------------------------------------- */
  /*                               Data formatting                              */
  /* -------------------------------------------------------------------------- */

  /**
   * Get the most common tags in scenes the performer is featured in. Returns a
   * string formatted as "Tag name A (count), Tag name B (count)..." etc.
   */
  const getMostCommonTags = (scenes: StashGQLScene[], tagCount: number = 3) => {
    // Create an array of tag data from all scenes
    const tags: {
      count: number;
      id: StashGQLTag["id"];
      name: StashGQLTag["name"];
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
      let tagString = "";
      for (let i = 0; i < maxTags; i++) {
        tagString +=
          (i === 0 ? "" : ", ") + `${tags[i].name} (${tags[i].count})`;
      }
      return tagString;
    } else {
      return null;
    }
  };

  /** Get the performer's most featured studio based on scenes in the user's
   * library. Returns a string formatted as "Studio (count)"  */
  const getMostFrequentStudio = (scenes: StashGQLScene[]) => {
    // Create an array of studio data from all scenes
    const studios: {
      count: number;
      id: StashGQLStudio["id"];
      name: StashGQLStudio["name"];
    }[] = [];

    // Check each scene
    scenes.forEach((sc) => {
      // Check if the scene studio already exists in the array
      const studiosIndex = studios.findIndex((st) => st.id === sc.studio.id);

      if (studiosIndex !== -1) {
        // Increase the studio's count
        studios[studiosIndex].count++;
      } else {
        studios.push({ id: sc.studio.id, count: 1, name: sc.studio.name });
      }
    });

    // Sort count from highest to lowest
    studios.sort((a, b) => b.count - a.count);

    // Return the studio with the highest overall count
    return studios.length ? `${studios[0].name} (${studios[0].count})` : null;
  };

  /* -------------------------------------------------------------------------- */
  /*                               PluginApi patch                              */
  /* -------------------------------------------------------------------------- */

  PluginApi.patch.after(
    "PerformerDetailsPanel.DetailGroup",
    function ({
      children,
      collapsed,
      performer,
    }: PropsPerformerDetailsPanelDetailGroup) {
      const performerID = performer.id;

      //@ts-ignore
      const qScenes = GQL.useFindScenesQuery({
        variables: {
          filter: { per_page: -1, sort: "date" },
          scene_filter: {
            performers: { modifier: "INCLUDES", value: performerID },
          },
        },
      });

      console.log("Scenes data:", qScenes);

      // Only attach plugin component if scene data has been found. Otherwise,
      // return the original component only.
      if (
        !!qScenes.data &&
        qScenes.data.findScenes.scenes.length &&
        performerID !== null
      ) {
        const { scenes } = qScenes.data.findScenes;

        const libraryCareerSpanProps = createLibraryCareerProps(
          { oldestScene: scenes[0], newestScene: scenes[scenes.length - 1] },
          collapsed
        );

        const libraryMetadata: DetailItemProps[] = [libraryCareerSpanProps];

        const mostFrequentPartner = createFrequentPartnerProps(
          {
            scenes,
            performerID,
          },
          collapsed,
          React
        );
        if (!!mostFrequentPartner) libraryMetadata.push(mostFrequentPartner);

        for (const gender of [
          "MALE",
          "FEMALE",
          "TRANSGENDER_MALE",
          "TRANSGENDER_FEMALE",
          "INTERSEX",
          "NON_BINARY",
        ] as StashGQLGenderEnum[]) {
          const mostFrequentGenderedPartner = createFrequentPartnerProps(
            {
              scenes,
              performerID,
              gender,
            },
            collapsed,
            React
          );
          if (!!mostFrequentGenderedPartner)
            libraryMetadata.push(mostFrequentGenderedPartner);
        }

        const pluginData = {
          mostCommonTags: getMostCommonTags(scenes, 5),
          mostFrequentStudio: getMostFrequentStudio(scenes),
        };
        console.log("Performer Library Meta:", pluginData);
        return [
          <>
            <div className="detail-group">{children}</div>
            <DetailGroup
              groupID="pluginPerformerLibraryMeta"
              items={libraryMetadata}
            />
          </>,
        ];
      }

      return [<div className="detail-group">{children}</div>];
    }
  );
})();
