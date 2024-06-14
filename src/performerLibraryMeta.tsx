import { GENDERS } from "./common/constants";
import DetailGroup from "./components/DetailGroup";
import ItemPlayCount from "./components/ItemPlayCount";
import {
  createCommonTagsProps,
  createFrequentPartnerProps,
  createFrequentStudioProps,
  createLibraryCareerProps,
} from "./data";

const { PluginApi } = window;
const { GQL, React } = PluginApi;

/* -------------------------------------------------------------------------- */
/*                               PluginApi patch                              */
/* -------------------------------------------------------------------------- */

PluginApi.patch.after(
  "PerformerDetailsPanel.DetailGroup",
  function ({ children, collapsed, performer }) {
    const performerID = performer.id;

    const qScenes = GQL.useFindScenesQuery({
      variables: {
        filter: { per_page: -1, sort: "date" },
        scene_filter: {
          performers: {
            modifier: CriterionModifier.Includes,
            value: [performerID],
          },
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

      const libraryMetadata = [libraryCareerSpanProps];

      const mostFrequentPartner = createFrequentPartnerProps(
        {
          scenes,
          performerID,
        },
        collapsed
      );
      if (!!mostFrequentPartner) libraryMetadata.push(mostFrequentPartner);

      for (const gender of GENDERS) {
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

      const frequentStudio = createFrequentStudioProps({ scenes }, collapsed);
      if (!!frequentStudio) libraryMetadata.push(frequentStudio);

      return [
        <>
          <div className="detail-group">{children}</div>
          <DetailGroup
            groupID="pluginPerformerLibraryMeta"
            items={libraryMetadata}
          />
          <div id="pluginPerformerLibraryMeta" className="detail-group">
            <ItemPlayCount collapsed={collapsed} performerIDs={[performerID]} />
          </div>
        </>,
      ];
    }

    return [<div className="detail-group">{children}</div>];
  }
);
