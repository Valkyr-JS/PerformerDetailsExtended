import { DetailItemProps } from "../components/DetailItem";

const { React } = window.PluginApi;

/** Get the performer's most featured studio based on scenes in the user's
 * library. Returns a string formatted as "Studio (count)"  */
const createFrequentStudioProps: FnCreateFrequentStudioProps = (
  { scenes },
  collapsed
) => {
  // Create an array of studio data from all scenes
  const studios: {
    count: number;
    id: Studio["id"];
    name: Studio["name"];
  }[] = [];

  // Check each scene
  scenes.forEach((sc) => {
    // Check if the scene studio already exists in the array
    const studiosIndex = studios.findIndex((st) => st.id === sc.studio?.id);

    if (!sc.studio) return;

    if (studiosIndex !== -1) {
      // Increase the studio's count
      studios[studiosIndex].count++;
    } else {
      studios.push({ id: sc.studio.id, count: 1, name: sc.studio.name });
    }
  });

  // Sort count from highest to lowest
  studios.sort((a, b) => b.count - a.count);

  if (studios.length) {
    const props = {
      id: "frequent-studio",
      collapsed,
      title: "Most Frequent Studio",
      value: `${studios[0].name} (${studios[0].count})`,
      wide: false,
    };

    return props;
  }

  return null;
};

export default createFrequentStudioProps;

interface IcreateFrequentStudio {
  scenes: Scene[];
}

type FnCreateFrequentStudioProps = (
  args: IcreateFrequentStudio,
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: boolean
) => DetailItemProps | null;
