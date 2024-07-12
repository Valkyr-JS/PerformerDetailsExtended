import {
  getGenderFromEnum,
  linkToPartnerProfile,
  tagIsDescendantOf,
} from "../helpers";
import { GENDERS } from "../common/constants";
import DetailItem from "./DetailItem";
import OverflowPopover from "./OverflowPopover";
const { React } = window.PluginApi;
const { HoverPopover } = window.PluginApi.components;

const ItemAppearsMostWith: React.FC<ItemAppearsMostWithProps> = ({
  allTagsQueryResult,
  performer,
  ...props
}) => {
  const {
    appearsMostWithTagsBlacklist,
    appearsMostWithTagsBlacklistChildren,
    appearsMostWithGendered,
    maximumTops,
    minimumAppearances,
  } = props.pluginConfig;

  // Create blacklist array
  const blacklist = appearsMostWithTagsBlacklist
    .split(",")
    .map((tag) => tag.trim());

  // Create an array of performer data from all scenes
  const partners: {
    count: number;
    data: Performer;
  }[] = [];

  // Filter out scenes with only one performer
  const partneredScenes = props.scenesQueryResult.scenes.filter(
    (sc) => sc.performers.length > 1
  );

  // Filter scenes to those that don't include blacklisted tags
  const filteredScenes = !appearsMostWithTagsBlacklist
    ? partneredScenes
    : partneredScenes.filter(({ tags }) => {
        const noBlacklistedTags = !tags
          .map((tag) => {
            // Check if the tag is in the blacklist. If so, skip it.
            if (blacklist.findIndex((t) => t === tag.name.trim()) !== -1)
              return false;

            // If blacklisting child tags is active, check if this tag is a
            // descendant of a blacklisted tag.
            if (appearsMostWithTagsBlacklistChildren) {
              for (const blTag of blacklist) {
                if (allTagsQueryResult.tags.find((tg) => tg.name === blTag)) {
                  if (tagIsDescendantOf(allTagsQueryResult, tag.name, blTag)) {
                    return false;
                  }
                }
              }
            }
            return true;
          })
          .includes(false);
        return noBlacklistedTags;
      });

  filteredScenes.forEach((sc) => {
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
        const scenesLink = linkToPartnerProfile(performer, p.data.id);

        return { data: p.data, scenesLink };
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
        const popoverContent = (
          <div className="performer-tag-container row">
            <a
              href={linkToPartnerProfile(performer, topPartnersData[i].data.id)}
              className="performer-tag col m-auto zoom-2"
            >
              <img
                className="image-thumbnail"
                alt={topPartnersData[i].data.name ?? ""}
                src={topPartnersData[i].data.image_path ?? ""}
              />
            </a>
          </div>
        );

        links.push(
          <HoverPopover
            className="performer-count"
            content={popoverContent}
            placement="bottom"
          >
            <a href={topPartnersData[i].scenesLink}>
              {topPartnersData[i].data.name}
            </a>
          </HoverPopover>
        );
        if (i !== maxLinks - 1) links.push(" / ");
      }

      if (topPartners.length > maxLinks) {
        const hoverContent = topPartners.map((p) => ({
          data: p.data,
          link: linkToPartnerProfile(performer, p.data.id),
        }));

        links.push(
          <OverflowPopover items={hoverContent} overflowAt={maxLinks}>
            <span className="top-meta-overflow hoverable">
              and {topPartners.length - maxLinks} more
            </span>
          </OverflowPopover>
        );
      }

      const value = <div className="inner-wrapper">{...links}</div>;

      return (
        <DetailItem
          collapsed={props.collapsed}
          id={"appears-most-with" + id}
          title={"Appears Most With " + genderSuffix}
          value={value}
          wide={true}
          additionalData={{
            dataValue: highestCount,
            id: "scene-count",
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
  const scenesLink = linkToPartnerProfile(performer, topPartner.data.id);

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
  /** The `findTags` data object returned from the unfiltered GQL query. */
  allTagsQueryResult: FindTagsResultType;
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: PropsPerformerDetailsPanelDetailGroup["collapsed"];
  /** The current Stash performer. */
  performer: Performer;
  /** The plugin config data. */
  pluginConfig: PDEFinalConfigMap;
  /** The `findScenes` data object returned from the GQL query. */
  scenesQueryResult: FindScenesResultType;
}
