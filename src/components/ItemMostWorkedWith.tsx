import { getGenderFromEnum } from "../../helpers";
import DetailItem from "./DetailItem";
const { React } = window.PluginApi;
const { makePerformerScenesUrl } = window.PluginApi.utils.NavUtils;

const ItemMostWorkedWith: React.FC<ItemMostWorkedWithProps> = ({
  gender,
  performer,
  ...props
}) => {
  const genderWord =
    typeof gender === "undefined" ? "" : " (" + getGenderFromEnum(gender) + ")";
  const id = genderWord.toLowerCase().split(" ").join("-");

  // Create an array of performer data from all scenes
  const partners: {
    count: number;
    data: Performer;
  }[] = [];

  // Check each scene
  props.scenesQueryResult.scenes.forEach((sc) => {
    // Check each performer in the scene
    sc.performers.forEach((pf) => {
      // Check this is not the featured performer
      if (pf.id !== performer.id) {
        // Check if the performer already exists in the array
        const perfomersIndex = partners.findIndex(
          (ptnr) => ptnr.data.id === pf.id
        );

        if (perfomersIndex !== -1) {
          // Increase the performer count
          partners[perfomersIndex].count++;
        } else {
          // Add the performer to the array
          partners.push({
            count: 1,
            data: pf,
          });
        }
      }
    });
  });

  // Sort count from highest to lowest
  partners.sort((a, b) => b.count - a.count);

  const topPartner = gender
    ? partners[partners.findIndex((p) => p.data.gender === gender)]
    : partners[0];

  if (!topPartner) return null;

  const scenesText =
    topPartner.count + " " + (topPartner.count === 1 ? "scene" : "scenes");

  const scenesLink = makePerformerScenesUrl(performer, {
    id: topPartner.data.id,
    label: topPartner.data.name,
  });

  return (
    <DetailItem
      collapsed={props.collapsed}
      id={"most-worked-with" + id}
      title={"Most Worked With " + genderWord}
      value={<a href={scenesLink}>{topPartner.data.name}</a>}
      wide={true}
      additionalData={{
        id: "scene-count",
        value: scenesText,
      }}
    />
  );
};

export default ItemMostWorkedWith;

interface ItemMostWorkedWithProps {
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: PropsPerformerDetailsPanelDetailGroup["collapsed"];
  /** The current Stash performer. */
  performer: Performer;
  /** The `findScenes` data object returned from the GQL query. */
  scenesQueryResult: FindScenesResultType;
  /** The gender to return item data for. Leave undefined to return data across
   * all genders. */
  gender?: GenderEnum;
}
