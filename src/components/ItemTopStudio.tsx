import { createOverflowText } from "../helpers";
import DetailItem from "./DetailItem";
const { React } = window.PluginApi;

const ItemTopStudio: React.FC<ItemTopStudioProps> = ({
  performer,
  ...props
}) => {
  const { maximumTops, minimumAppearances, topNetworkOn } = props.pluginConfig;
  const { studios } = props.studiosQueryResult;
  const { scenes } = props.scenesQueryResult;

  if (studios.length === 0) return null;

  /* ------------------------------- Studio data ------------------------------ */

  // Create an array of studio data from all scenes
  const studiosData: IstudioData[] = [];

  // Check each scene
  scenes.forEach((sc) => {
    // If there is no studio attached to the scene, skip the scene.
    if (!sc.studio) return;

    // Check if the scene studio already exists in the array
    const studiosIndex = studiosData.findIndex(
      (st) => st.data.id === sc.studio?.id
    );

    if (studiosIndex !== -1) {
      // Studio already appears the array. Increase its count.
      studiosData[studiosIndex].count++;
    } else {
      // Add the studio to the array
      studiosData.push({ count: 1, data: sc.studio });
    }
  });

  // Sort count from highest to lowest number of scenes.
  const sortHighToLow = (a: IstudioData, b: IstudioData) => b.count - a.count;
  const sortedStudios = studiosData.sort(sortHighToLow);

  // If there are no studios or the top studio's count is less than the minimum
  // required, don't return a component.
  if (sortedStudios.length === 0 || sortedStudios[0].count < minimumAppearances)
    return null;

  const highestValue = sortedStudios[0].count;
  const topStudios = sortedStudios
    .filter((st) => st.count === highestValue)
    .sort((a, b) => a.data.name.localeCompare(b.data.name, "en"));

  const topStudioData = topStudios.map((st) => {
    const scenesLink = `/studios/${
      st.data.id
    }/scenes?c=("type":"performers","value":("items":%5B("id":"${
      performer.id
    }","label":"${encodeURIComponent(
      performer.name
    )}")%5D,"excluded":%5B%5D),"modifier":"INCLUDES")`;
    return { scenesLink, name: st.data.name };
  });

  const scenesText = highestValue + (highestValue === 1 ? " scene" : " scenes");
  const maxLinks =
    topStudioData.length < maximumTops ? topStudioData.length : maximumTops;

  let links = [];
  for (let i = 0; i < maxLinks; i++) {
    links.push(
      <a href={topStudioData[i].scenesLink}>{topStudioData[i].name}</a>
    );
    if (i !== maxLinks - 1) links.push(" / ");
  }

  if (topStudioData.length > maxLinks) {
    const names = topStudioData.map((st) => st.name);
    const title = createOverflowText(names, maxLinks);

    links.push(
      <>
        {" "}
        <span className="top-meta-overflow hoverable" title={title}>
          and {topStudioData.length - maxLinks} more
        </span>
      </>
    );
  }

  const value = <>{...links}</>;

  /* ------------------------------ Network data ------------------------------ */

  let itemTopNetworkOn = null;

  if (topNetworkOn) {
    // Create an array of network data from all scenes
    const networksData: IstudioData[] = [];

    // If the scene studio has a network, use it. Otherwise treat the studio as
    // the network.
    const getNetworkData = (studioID: Studio["id"] | undefined) => {
      if (typeof studioID === "undefined") return undefined;
      const studioData = props.studiosQueryResult.studios.find(
        (st) => st.id === studioID
      );
      return studioData?.parent_studio ? studioData.parent_studio : studioData;
    };

    // Check each scene
    scenes.forEach((sc) => {
      /**
       * ! `findStudios` is currently bugged when trying to filter to return
       * studios featuring scenes featuring performer. Once that's fixed, this
       * can be streamlined to use that data.
       */
      const network = getNetworkData(sc.studio?.id);

      // If network is undefined or null, or exists in the top studio list, skip it
      if (!network) return;

      // Check if the scene network already exists in the array
      const networksIndex = networksData.findIndex(
        (nw) => nw.data.id === network.id
      );

      if (networksIndex !== -1) {
        // Network already appears the array. Increase its count.
        networksData[networksIndex].count++;
      } else {
        // Add the network to the array
        networksData.push({ count: 1, data: network });
      }
    });

    if (networksData.length > 0) {
      // Sort count from highest to lowest number of scenes.
      const sortedNetworks = networksData.sort(sortHighToLow);

      // If there are no networks or the top networks's count is less than the
      // minimum required, don't return a component.
      if (
        sortedNetworks.length === 0 ||
        sortedNetworks[0].count < minimumAppearances
      )
        return null;

      const highestNwValue = sortedNetworks[0].count;
      const topNetworks = sortedNetworks
        .filter((st) => st.count === highestNwValue)
        .sort((a, b) => a.data.name.localeCompare(b.data.name, "en"));

      const topNetworkData = topNetworks.map((st) => {
        const scenesLink = `/studios/${
          st.data.id
        }/scenes?c=("type":"performers","value":("items":%5B("id":"${
          performer.id
        }","label":"${encodeURIComponent(
          performer.name
        )}")%5D,"excluded":%5B%5D),"modifier":"INCLUDES")`;
        return { scenesLink, name: st.data.name };
      });

      const nwScenesText =
        highestNwValue + (highestNwValue === 1 ? " scene" : " scenes");
      const nwMaxLinks =
        topNetworkData.length < maximumTops
          ? topNetworkData.length
          : maximumTops;

      let nwLinks = [];
      for (let i = 0; i < nwMaxLinks; i++) {
        nwLinks.push(
          <a href={topNetworkData[i].scenesLink}>{topNetworkData[i].name}</a>
        );
        if (i !== nwMaxLinks - 1) nwLinks.push(" / ");
      }

      if (topNetworkData.length > nwMaxLinks) {
        const names = topNetworkData.map((nw) => nw.name);
        const title = createOverflowText(names, maxLinks);

        nwLinks.push(
          <>
            {" "}
            <span className="top-meta-overflow hoverable" title={title}>
              and {topNetworkData.length - maxLinks} more
            </span>
          </>
        );
      }

      const nwValue = <>{...nwLinks}</>;

      // Don't return the network unless it is different from the top studio and
      // its count is at least the minimum required.
      if (!(highestNwValue < minimumAppearances)) {
        itemTopNetworkOn = (
          <DetailItem
            collapsed={props.collapsed}
            id="top-network"
            title={"Top Network" + (topNetworkData.length > 1 ? "s" : "")}
            value={nwValue}
            wide={true}
            additionalData={{
              id: "top-network-scenes",
              value: nwScenesText,
            }}
          />
        );
      }
    }
  }

  return (
    <>
      <DetailItem
        collapsed={props.collapsed}
        id="top-studio"
        title={"Top Studio" + (topStudioData.length > 1 ? "s" : "")}
        value={value}
        wide={true}
        additionalData={{
          id: "top-studio-scenes",
          value: scenesText,
        }}
      />
      {itemTopNetworkOn}
    </>
  );
};

export default ItemTopStudio;

interface ItemTopStudioProps {
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: PropsPerformerDetailsPanelDetailGroup["collapsed"];
  /** The current Stash performer. */
  performer: Performer;
  /** The plugin config data. */
  pluginConfig: PDEFinalConfigMap;
  /** The `findScenes` data object returned from the GQL query. */
  scenesQueryResult: FindScenesResultType;
  /** The `findStudios` data object returned from the GQL query. */
  studiosQueryResult: FindStudiosResultType;
}

interface IstudioData {
  count: number;
  data: Studio;
}
