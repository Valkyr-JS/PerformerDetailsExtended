import DetailItem from "./DetailItem";
const { React } = window.PluginApi;

const ItemAverageRating: React.FC<ItemAverageRatingProps> = (props) => {
  // Get the user's rating system
  const ratingSystem = props.configurationQueryResult.ui
    .ratingSystemOptions as IratingSystemOptions;

  // Get the rating for each scene
  const { scenes } = props.scenesQueryResult;
  const sceneRatings = scenes
    .map((sc) => (typeof sc.rating100 === "undefined" ? null : sc.rating100))
    .filter((r) => r !== null);

  // Only return a component if at least one scene has been rated.
  if (!sceneRatings.length) return null;

  const averageRating100 = Math.round(
    ((sceneRatings.reduce((a, b) => (a || 0) + (b || 0), 0) || 0) +
      Number.EPSILON) /
      sceneRatings.length
  );

  const rating =
    ratingSystem.type === "decimal"
      ? averageRating100 / 10
      : averageRating100 / 20;

  const additionalValue = `${sceneRatings.length} of ${scenes.length} scenes rated`;

  return (
    <DetailItem
      collapsed={props.collapsed}
      id="average-rating"
      title="Average Scene Rating"
      value={rating}
      wide={true}
      additionalData={{
        id: "scenes-rated",
        value: additionalValue,
      }}
    />
  );
};

export default ItemAverageRating;

interface ItemAverageRatingProps {
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: PropsPerformerDetailsPanelDetailGroup["collapsed"];
  /** The `configuration` data object returned from the GQL query. */
  configurationQueryResult: ConfigResult;
  /** The current Stash performer. */
  performer: Performer;
  /** The `findScenes` data object returned from the GQL query. */
  scenesQueryResult: FindScenesResultType;
}
