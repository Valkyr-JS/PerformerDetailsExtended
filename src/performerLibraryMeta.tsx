import { GENDERS } from "./common/constants";
import DetailGroup from "./components/DetailGroup";
import ItemMostCommonTags from "./components/Item.CommonTags";
import ItemMostFeaturedOn from "./components/ItemMostFeaturedOn";
import ItemMostWorkedWith from "./components/ItemMostWorkedWith";
import ItemPlayCount from "./components/ItemPlayCount";
import ItemScenesTimespan from "./components/ItemScenesTimespan";
import "./performerLibraryMeta.scss";

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
      const scenesQueryResult = qScenes.data.findScenes;
      return [
        <>
          <DetailGroup>{children}</DetailGroup>
          <DetailGroup id="pluginPerformerLibraryMeta">
            <ItemPlayCount
              collapsed={collapsed}
              scenesQueryResult={scenesQueryResult}
            />
            <ItemMostFeaturedOn
              collapsed={collapsed}
              performer={performer}
              scenesQueryResult={scenesQueryResult}
            />
            <ItemScenesTimespan
              collapsed={collapsed}
              scenesQueryResult={scenesQueryResult}
            />
            <ItemMostWorkedWith
              collapsed={collapsed}
              performer={performer}
              scenesQueryResult={scenesQueryResult}
            />
            {GENDERS.map((g) => (
              <ItemMostWorkedWith
                collapsed={collapsed}
                gender={g}
                performer={performer}
                scenesQueryResult={scenesQueryResult}
              />
            ))}
            <ItemMostCommonTags
              collapsed={collapsed}
              performer={performer}
              scenesQueryResult={scenesQueryResult}
            />
          </DetailGroup>
        </>,
      ];
    }

    return [<div className="detail-group">{children}</div>];
  }
);
