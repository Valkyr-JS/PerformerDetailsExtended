import DetailGroup from "./components/DetailGroup";
import type { DetailItemProps } from "./components/DetailItem";
import {
  createCommonTagsProps,
  createFrequentPartnerProps,
  createLibraryCareerProps,
} from "./data";

const { PluginApi } = window;
const { GQL, React } = PluginApi;

/* -------------------------------------------------------------------------- */
/*                               Data formatting                              */
/* -------------------------------------------------------------------------- */

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
        collapsed
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
          collapsed
        );
        if (!!mostFrequentGenderedPartner)
          libraryMetadata.push(mostFrequentGenderedPartner);
      }

      const mostCommonTags = createCommonTagsProps(
        { scenes, tagCount: 5 },
        collapsed
      );
      if (!!mostCommonTags) libraryMetadata.push(mostCommonTags);

      const pluginData = {
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
