import { createOverflowText, getGenderFromEnum } from "../helpers";
import { GENDERS } from "../common/constants";
import DetailItem from "./DetailItem";
const { React } = window.PluginApi;
const { makePerformerScenesUrl } = window.PluginApi.utils.NavUtils;

const ItemAppearsMostWith: React.FC<ItemAppearsMostWithProps> = ({
  performer,
  ...props
}) => {
  const { appearsMostWithGendered, maximumTops, minimumAppearances } =
    props.pluginConfig;

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

  // If the top partner's count is less than the minimum required, don't return
  // a component.
  if (partners.length === 0 || partners[0].count < minimumAppearances)
    return null;

  if (appearsMostWithGendered) {
    return GENDERS.map((g) => {
      const genderedPartners = partners.filter((p) => p.data.gender === g);

      // If there is no partner for the current gender or the top partner's
      // count is less than the minimum required, don't return a component.
      if (
        genderedPartners.length === 0 ||
        genderedPartners[0].count < minimumAppearances
      )
        return null;

      const highestCount = genderedPartners[0].count;
      const topPartners = genderedPartners
        .filter((p) => p.count === highestCount)
        .sort((a, b) => a.data.name.localeCompare(b.data.name, "en"));

      const topPartnersData = topPartners.map((p) => {
        const scenesLink = makePerformerScenesUrl(performer, {
          id: p.data.id,
          label: p.data.name,
        });

        return { name: p.data.name, scenesLink };
      });

      const genderWord = getGenderFromEnum(g);
      const genderSuffix = genderWord ? " (" + genderWord + ")" : "";
      const id = genderWord
        ? "-" + genderWord.toLowerCase().split(" ").join("-")
        : "";
      const scenesText =
        topPartners[0].count +
        " " +
        (topPartners[0].count === 1 ? "scene" : "scenes");

      const maxLinks =
        topPartners.length < maximumTops ? topPartners.length : maximumTops;

      let links = [];
      for (let i = 0; i < maxLinks; i++) {
        links.push(
          <a href={topPartnersData[i].scenesLink}>{topPartnersData[i].name}</a>
        );
        if (i !== maxLinks - 1) links.push(" / ");
      }

      if (topPartners.length > maxLinks) {
        const names = topPartners.map((p) => p.data.name);
        const title = createOverflowText(names, maxLinks);

        links.push(
          <>
            {" "}
            <span className="top-meta-overflow hoverable" title={title}>
              and {topPartners.length - maxLinks} more
            </span>
          </>
        );
      }

      const value = <>{...links}</>;

      return (
        <DetailItem
          collapsed={props.collapsed}
          id={"appears-most-with" + id}
          title={"Appears Most With " + genderSuffix}
          value={value}
          wide={true}
          additionalData={{
            id: "scene-count",
            dataValue: highestCount,
            value: scenesText,
          }}
        />
      );
    });
  }

  const topPartner = partners[0];

  // If the top partner's count is less than the minimum required, don't return
  // a component.
  if (topPartner.count < minimumAppearances) return null;

  const scenesText =
    topPartner.count + " " + (topPartner.count === 1 ? "scene" : "scenes");
  const scenesLink = makePerformerScenesUrl(performer, {
    id: topPartner.data.id,
    label: topPartner.data.name,
  });

  return (
    <DetailItem
      collapsed={props.collapsed}
      id={"appears-most-with"}
      title={"Appears Most With"}
      value={<a href={scenesLink}>{topPartner.data.name}</a>}
      wide={true}
      additionalData={{
        id: "scene-count",
        dataValue: topPartner.count,
        value: scenesText,
      }}
    />
  );
};

export default ItemAppearsMostWith;

interface ItemAppearsMostWithProps {
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: PropsPerformerDetailsPanelDetailGroup["collapsed"];
  /** The current Stash performer. */
  performer: Performer;
  /** The plugin config data. */
  pluginConfig: PDEFinalConfigMap;
  /** The `findScenes` data object returned from the GQL query. */
  scenesQueryResult: FindScenesResultType;
}
