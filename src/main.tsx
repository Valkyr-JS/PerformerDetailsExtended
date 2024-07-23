import DetailGroup from "@components/DetailGroup";
import ItemAverageRating from "@components/ItemAverageRating";
import ItemAppearsMostWith from "@components/ItemAppearsMostWith";
import ItemOCount from "@components/ItemOCount";
import ItemScenesOrganized from "@components/ItemScenesOrganized";
import ItemScenesTimespan from "@components/ItemScenesTimespan";
import ItemTopStudio from "@components/ItemTopStudio";
import ItemTopTags from "@components/ItemTopTags";
import ItemTotalContent from "@components/ItemTotalContent";
import ItemTotalPlayDuration from "@components/ItemTotalPlayDuration";
import NativeItemFakeTits from "@components/NativeItemFakeTits";
import { default as cx } from "classnames";
import "./styles.scss";

const { PluginApi } = window;
const { GQL, React } = PluginApi;
const { LoadingIndicator } = PluginApi.components;

/* -------------------------------------------------------------------------- */
/*                               PluginApi patch                              */
/* -------------------------------------------------------------------------- */

PluginApi.patch.instead(
  "PerformerDetailsPanel.DetailGroup",
  function (props, _, Original) {
    const { children, collapsed, performer } = props;
    const performerID = performer.id;

    /* ------------------------------ Configuration ----------------------------- */

    // Get config data before doing anything else
    const qConfig = GQL.useConfigurationQuery();
    if (qConfig.loading) return [];

    const configurationQueryResult = qConfig.data
      .configuration as PDEConfigResult;
    const { compactExpandedDetails, showAllDetails } =
      configurationQueryResult.ui;
    const userConfig =
      configurationQueryResult.plugins.PerformerDetailsExtended;

    // Compile the user's config with config defaults
    const pluginConfig: PDEFinalConfigMap = {
      additionalStyling: userConfig?.additionalStyling ?? false,
      appearsMostWithTagsBlacklist:
        userConfig?.appearsMostWithTagsBlacklist ?? "",
      appearsMostWithTagsBlacklistChildren:
        userConfig?.appearsMostWithTagsBlacklistChildren ?? false,
      appearsMostWithGendered: userConfig?.appearsMostWithGendered ?? true,
      maximumTops: userConfig?.maximumTops ?? 3,
      minimumAppearances: userConfig?.minimumAppearances ?? 2,
      nativeFakeTitsHeading: userConfig?.nativeFakeTitsHeading,
      scenesTimespanReverse: userConfig?.scenesTimespanReverse ?? false,
      showWhenCollapsed:
        userConfig?.showWhenCollapsed ?? (showAllDetails || false),
      topNetworkOn: userConfig?.topNetworkOn ?? true,
      topTagsBlacklist: userConfig?.topTagsBlacklist ?? "",
      topTagsBlacklistChildren: userConfig?.topTagsBlacklistChildren ?? false,
      // For topTagsCount, set to 3 if the value is undefined or 0.
      topTagsCount: userConfig?.topTagsCount ?? 3,
      topTagsOn: userConfig?.topTagsOn ?? true,
      totalPlayCountOn: userConfig?.totalPlayCountOn ?? false,
    };

    const originalComponent = (
      <DetailGroup
        {...props}
        children={replaceNativeItems(
          children as React.JSX.Element[],
          pluginConfig,
          collapsed
        )}
        className={cx({
          "detail-group-pde-themed": pluginConfig.additionalStyling,
        })}
      />
    );

    /* --------------------------- Fetch required data -------------------------- */

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

    const qAllTags = GQL.useFindTagsQuery({
      variables: {
        filter: { per_page: -1, sort: "id" },
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

    const qStats = GQL.useStatsQuery();

    /**
     * Only display the plugin data if:
     * * The required data has been loaded.
     * * AND The performer details section is NOT collapsed
     * * UNLESS the user has set to override this behaviour.
     */
    const dataLoading =
      qScenes.loading || qAllTags.loading || qStats.loading || qStudios.loading;

    /** Display as collapsed if currently collapsed, or compact details is
     * `true` in the native config. */
    const isCollapsed = collapsed || !!compactExpandedDetails;
    const showDetails = !collapsed || pluginConfig.showWhenCollapsed;

    // Render the original component and a loading indicator until the required
    // data is available
    if (dataLoading && showDetails)
      return [
        <>
          {originalComponent}
          <LoadingIndicator card message="Loading extended details..." />
        </>,
      ];

    if (dataLoading || !showDetails) return [originalComponent];

    const scenesQueryResult = qScenes.data.findScenes;
    const allTagsQueryResult = qAllTags.data.findTags;
    const statsQueryResult = qStats.data.stats;
    const studiosQueryResult = qStudios.data.findStudios;

    /* -------------------------------- Component ------------------------------- */

    return [
      <>
        {originalComponent}
        <DetailGroup
          id="performerDetailsExtended"
          className={cx("performer-details-extended", {
            "detail-group-pde-themed": pluginConfig.additionalStyling,
          })}
        >
          <ItemAverageRating
            collapsed={isCollapsed}
            configurationQueryResult={configurationQueryResult}
            performer={performer}
            scenesQueryResult={scenesQueryResult}
          />
          <ItemAppearsMostWith
            allTagsQueryResult={allTagsQueryResult}
            collapsed={isCollapsed}
            performer={performer}
            pluginConfig={pluginConfig}
            scenesQueryResult={scenesQueryResult}
          />
          <ItemTopStudio
            collapsed={isCollapsed}
            performer={performer}
            pluginConfig={pluginConfig}
            scenesQueryResult={scenesQueryResult}
            studiosQueryResult={studiosQueryResult}
          />
          <ItemTotalContent
            collapsed={isCollapsed}
            scenesQueryResult={scenesQueryResult}
          />
          <ItemTotalPlayDuration
            collapsed={isCollapsed}
            pluginConfig={pluginConfig}
            scenesQueryResult={scenesQueryResult}
            statsQueryResult={statsQueryResult}
          />
          <ItemScenesTimespan
            collapsed={isCollapsed}
            pluginConfig={pluginConfig}
            scenesQueryResult={scenesQueryResult}
          />
          <ItemScenesOrganized
            collapsed={isCollapsed}
            scenesQueryResult={scenesQueryResult}
          />
          <ItemOCount
            collapsed={isCollapsed}
            scenesQueryResult={scenesQueryResult}
            statsQueryResult={statsQueryResult}
          />
          <ItemTopTags
            allTagsQueryResult={allTagsQueryResult}
            collapsed={collapsed}
            performer={performer}
            pluginConfig={pluginConfig}
            scenesQueryResult={scenesQueryResult}
          />
        </DetailGroup>
      </>,
    ];
  }
);

/** Replace native items as required. */
const replaceNativeItems = (
  children: React.JSX.Element[],
  config: PDEFinalConfigMap,
  isCollapsed: boolean
) =>
  children.map((ch) => {
    if (ch?.props.id === "fake_tits" && !!config.nativeFakeTitsHeading) {
      const props = {
        collapsed: isCollapsed,
        fullWidth: ch.props.fullWidth as boolean,
        id: ch.props.id as string,
        title: config.nativeFakeTitsHeading,
        value: ch.props.value as string,
      };
      return <NativeItemFakeTits {...props} />;
    } else return ch;
  });
