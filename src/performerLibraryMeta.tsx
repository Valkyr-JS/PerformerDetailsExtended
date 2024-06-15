import DetailGroup from "./components/DetailGroup";
import ItemMostFeaturedOn from "./components/ItemMostFeaturedOn";
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
      return [
        <>
          <DetailGroup>{children}</DetailGroup>
          <DetailGroup id="pluginPerformerLibraryMeta">
            <ItemPlayCount
              collapsed={collapsed}
              scenesQueryResult={qScenes.data.findScenes}
            />
            <ItemMostFeaturedOn
              collapsed={collapsed}
              performer={performer}
              scenesQueryResult={qScenes.data.findScenes}
            />
            <ItemScenesTimespan
              collapsed={collapsed}
              scenesQueryResult={qScenes.data.findScenes}
            />
          </DetailGroup>
        </>,
      ];
    }

    return [<div className="detail-group">{children}</div>];
  }
);
