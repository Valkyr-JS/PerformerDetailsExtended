import DetailGroup from "./components/DetailGroup";
import ItemAverageRating from "./components/ItemAverageRating";
import ItemContentSize from "./components/ItemContentSize";
import ItemMostCommonTags from "./components/ItemCommonTags";
import ItemMostFeaturedOn from "./components/ItemMostFeaturedOn";
import ItemMostWorkedWith from "./components/ItemMostWorkedWith";
import ItemOCount from "./components/ItemOCount";
import ItemScenesOrganized from "./components/ItemScenesOrganized";
import ItemScenesTimespan from "./components/ItemScenesTimespan";
import ItemWatchedFor from "./components/ItemWatchedFor";
import "./styles.scss";

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
        filter: { per_page: -1 },
        scene_filter: {
          performers: {
            modifier: CriterionModifier.Includes,
            value: [performerID],
          },
        },
      },
    });

    const qAllStudios = GQL.useFindStudiosQuery({
      variables: { filter: { sort: "id" } },
    });

    const qConfig = GQL.useConfigurationQuery();
    const qStats = GQL.useStatsQuery();

    /**
     * Only display the plugin data if:
     * * The required data has been loaded.
     * * AND The performer details section is NOT collapsed
     * * UNLESS the user has set to override this behaviour.
     */
    const dataLoaded =
      !!qScenes.data &&
      qScenes.data.findScenes.scenes.length &&
      !!qConfig.data &&
      !!qStats.data &&
      !!qAllStudios.data &&
      performerID !== null;

    if (dataLoaded) {
      const allStudiosQueryResult = qAllStudios.data.findStudios;
      const configurationQueryResult = qConfig.data
        .configuration as PDEConfigResult;
      const scenesQueryResult = qScenes.data.findScenes;
      const statsQueryResult = qStats.data.stats;

      const { showAllDetails } = configurationQueryResult.ui;

      const userConfig =
        configurationQueryResult.plugins.PerformerDetailsExtended;

      // Compile the user's config with config defaults
      const pluginConfig: PDEFinalConfigMap = {
        // For mostCommonTagsCount, set to 3 if the value is undefined or 0.
        mostCommonTagsCount: userConfig?.mostCommonTagsCount || 3,
        mostCommonTagsOn: getConfigProp(userConfig?.mostCommonTagsOn, true),
        mostFeaturedNetworkOn: getConfigProp(
          userConfig?.mostFeaturedNetworkOn,
          true
        ),
        mostWorkedWithGendered: getConfigProp(
          userConfig?.mostCommonTagsOn,
          true
        ),
        showWhenCollapsed: getConfigProp(
          userConfig?.showWhenCollapsed,
          showAllDetails || false
        ),
      };

      const showDetails = !collapsed || pluginConfig.showWhenCollapsed;

      if (showDetails) {
        return [
          <>
            <DetailGroup>{children}</DetailGroup>
            <DetailGroup
              id="pde__entities"
              className="performer-details-extended"
            >
              <ItemAverageRating
                collapsed={collapsed}
                configurationQueryResult={configurationQueryResult}
                performer={performer}
                scenesQueryResult={scenesQueryResult}
              />
              <ItemMostWorkedWith
                collapsed={collapsed}
                performer={performer}
                pluginConfig={pluginConfig}
                scenesQueryResult={scenesQueryResult}
              />
              <ItemMostFeaturedOn
                allStudiosQueryResult={allStudiosQueryResult}
                collapsed={collapsed}
                performer={performer}
                pluginConfig={pluginConfig}
                scenesQueryResult={scenesQueryResult}
              />
              <ItemMostCommonTags
                collapsed={collapsed}
                performer={performer}
                pluginConfig={pluginConfig}
                scenesQueryResult={scenesQueryResult}
              />
            </DetailGroup>
            <DetailGroup
              id="pde__numbers"
              className="performer-details-extended"
            >
              <ItemContentSize
                collapsed={collapsed}
                scenesQueryResult={scenesQueryResult}
              />
              <ItemWatchedFor
                collapsed={collapsed}
                scenesQueryResult={scenesQueryResult}
              />
              <ItemScenesTimespan
                collapsed={collapsed}
                scenesQueryResult={scenesQueryResult}
              />
              <ItemScenesOrganized
                collapsed={collapsed}
                scenesQueryResult={scenesQueryResult}
              />
              <ItemOCount
                collapsed={collapsed}
                scenesQueryResult={scenesQueryResult}
                statsQueryResult={statsQueryResult}
              />
            </DetailGroup>
          </>,
        ];
      }
    }

    return [<div className="detail-group">{children}</div>];
  }
);

/** Returns the given property from the user's config, or the default value if
 * the user hasn't explicitly set it. */
function getConfigProp<T>(value: T | undefined, defaultValue: T) {
  return typeof value !== "undefined" ? value : defaultValue;
}
