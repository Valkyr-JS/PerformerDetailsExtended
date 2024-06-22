import DetailGroup from "./components/DetailGroup";
import ItemAverageRating from "./components/ItemAverageRating";
import ItemAppearsMostWith from "./components/ItemAppearsMostWith";
import ItemOCount from "./components/ItemOCount";
import ItemScenesOrganized from "./components/ItemScenesOrganized";
import ItemScenesTimespan from "./components/ItemScenesTimespan";
import ItemTopStudio from "./components/ItemTopStudio";
import ItemTopTags from "./components/ItemTopTags";
import ItemTotalContent from "./components/ItemTotalContent";
import ItemTotalPlayDuration from "./components/ItemTotalPlayDuration";
import "./styles.scss";
import { default as cx } from "classnames";

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

    const qStudios = GQL.useFindStudiosQuery({
      variables: {
        filter: { per_page: -1, sort: "id" },
        studio_filter: {
          scenes_filter: {
            performers: {
              modifier: CriterionModifier.Includes,
              value: [performerID],
            },
          },
        },
      },
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
      !!qStudios.data &&
      performerID !== null;

    if (dataLoaded) {
      const configurationQueryResult = qConfig.data
        .configuration as PDEConfigResult;
      const scenesQueryResult = qScenes.data.findScenes;
      const statsQueryResult = qStats.data.stats;
      const studiosQueryResult = qStudios.data.findStudios;

      const { showAllDetails } = configurationQueryResult.ui;

      const userConfig =
        configurationQueryResult.plugins.PerformerDetailsExtended;

      // Compile the user's config with config defaults
      const pluginConfig: PDEFinalConfigMap = {
        additionalStyling: getConfigProp(userConfig?.additionalStyling, false),
        appearsMostWithGendered: getConfigProp(
          userConfig?.appearsMostWithGendered,
          true
        ),
        maximumTops: getConfigProp(userConfig?.maximumTops, 3),
        minimumAppearances: getConfigProp(userConfig?.minimumAppearances, 2),
        showWhenCollapsed: getConfigProp(
          userConfig?.showWhenCollapsed,
          showAllDetails || false
        ),
        topNetworkOn: getConfigProp(userConfig?.topNetworkOn, true),
        // For topTagsCount, set to 3 if the value is undefined or 0.
        topTagsCount: userConfig?.topTagsCount || 3,
        topTagsOn: getConfigProp(userConfig?.topTagsOn, true),
      };

      const showDetails = !collapsed || pluginConfig.showWhenCollapsed;

      if (showDetails) {
        return [
          <>
            <DetailGroup
              className={cx({
                "detail-group-pde-themed": pluginConfig.additionalStyling,
              })}
            >
              {children}
            </DetailGroup>
            <DetailGroup
              id="performerDetailsExtended"
              className={cx("performer-details-extended", {
                "detail-group-pde-themed": pluginConfig.additionalStyling,
              })}
            >
              <ItemAverageRating
                collapsed={collapsed}
                configurationQueryResult={configurationQueryResult}
                performer={performer}
                scenesQueryResult={scenesQueryResult}
              />
              <ItemAppearsMostWith
                collapsed={collapsed}
                performer={performer}
                pluginConfig={pluginConfig}
                scenesQueryResult={scenesQueryResult}
              />
              <ItemTopStudio
                collapsed={collapsed}
                performer={performer}
                pluginConfig={pluginConfig}
                scenesQueryResult={scenesQueryResult}
                studiosQueryResult={studiosQueryResult}
              />
              <ItemTotalContent
                collapsed={collapsed}
                scenesQueryResult={scenesQueryResult}
              />
              <ItemTotalPlayDuration
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
              <ItemTopTags
                collapsed={collapsed}
                performer={performer}
                pluginConfig={pluginConfig}
                scenesQueryResult={scenesQueryResult}
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
