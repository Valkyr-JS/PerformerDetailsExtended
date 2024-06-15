import DetailItem from "./DetailItem";
const { React } = window.PluginApi;

const ItemFrequentStudio: React.FC<ItemFrequentStudioProps> = ({
  collapsed,
  scenesQueryResult,
}) => {
  // Create an array of studio data from all scenes
  const studios: {
    count: number;
    id: Studio["id"];
    name: Studio["name"];
  }[] = [];

  const { scenes } = scenesQueryResult;

  if (scenes.length === 0) return null;

  // Check each scene
  scenesQueryResult.scenes.forEach((sc) => {
    // Check if the scene studio already exists in the array
    const studiosIndex = studios.findIndex((st) => st.id === sc.studio?.id);

    // If there is not studio attached to the scene, skip the scene.
    if (!sc.studio) return;

    if (studiosIndex !== -1) {
      // Studio already appears the array. Increase its count.
      studios[studiosIndex].count++;
    } else {
      // Add the studio to the array
      studios.push({ id: sc.studio.id, count: 1, name: sc.studio.name });
    }
  });

  // Sort count from highest to lowest number of scenes.
  studios.sort((a, b) => b.count - a.count);

  const topStudio = studios[0];
  const additionalDataValue =
    topStudio.count + (topStudio.count === 1 ? " scene" : " scenes");

  return (
    <DetailItem
      collapsed={collapsed}
      id="most-featured-on"
      title="Most Featured On"
      value={topStudio.name}
      wide={true}
      additionalData={{
        id: "featured-studio-scenes",
        value: additionalDataValue,
      }}
    />
  );
};

export default ItemFrequentStudio;

interface ItemFrequentStudioProps {
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: PropsPerformerDetailsPanelDetailGroup["collapsed"];
  /** The `findScenes` data object returned from the GQL query. */
  scenesQueryResult: FindScenesResultType;
}
