import DetailItem from "./DetailItem";
const { React } = window.PluginApi;

const ItemTopStudio: React.FC<ItemTopStudioProps> = ({
  performer,
  ...props
}) => {
  const { topNetworkOn } = props.pluginConfig;
  const { scenes } = props.scenesQueryResult;

  if (scenes.length === 0) return null;

  /* ------------------------------- Studio data ------------------------------ */

  // Create an array of studio data from all scenes
  const studios: IstudioCount[] = [];

  // Check each scene
  scenes.forEach((sc) => {
    // If there is no studio attached to the scene, skip the scene.
    if (!sc.studio) return;

    // Check if the scene studio already exists in the array
    const studiosIndex = studios.findIndex(
      (st) => st.data.id === sc.studio?.id
    );

    if (studiosIndex !== -1) {
      // Studio already appears the array. Increase its count.
      studios[studiosIndex].count++;
    } else {
      // Add the studio to the array
      studios.push({ count: 1, data: sc.studio });
    }
  });

  // Sort count from highest to lowest number of scenes.
  const sortHighToLow = (a: IstudioCount, b: IstudioCount) => b.count - a.count;
  studios.sort(sortHighToLow);

  const topStudio = studios[0];
  const additionalDataValue =
    topStudio.count + (topStudio.count === 1 ? " scene" : " scenes");
  const linkToStudio = `/studios/${
    topStudio.data.id
  }/scenes?c=("type":"performers","value":("items":%5B("id":"${
    performer.id
  }","label":"${encodeURIComponent(
    performer.name
  )}")%5D,"excluded":%5B%5D),"modifier":"INCLUDES")`;

  /* ------------------------------ Network data ------------------------------ */

  let itemTopNetworkOn = null;

  if (topNetworkOn) {
    // Create an array of network data from all scenes
    const networks: IstudioCount[] = [];

    // If the scene studio has a network, use it. Otherwise treat the studio as
    // the network.
    const getNetworkData = (studioID: Studio["id"] | undefined) => {
      if (typeof studioID === "undefined") return undefined;
      const studioData = props.allStudiosQueryResult.studios.find(
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

      // If network is undefined or null, skip
      if (!network) return;

      // Check if the scene network already exists in the array
      const networksIndex = networks.findIndex(
        (nw) => nw.data.id === network.id
      );

      if (networksIndex !== -1) {
        // Network already appears the array. Increase its count.
        networks[networksIndex].count++;
      } else {
        // Add the network to the array
        networks.push({ count: 1, data: network });
      }
    });

    if (networks.length > 0) {
      // Sort count from highest to lowest number of scenes.
      networks.sort(sortHighToLow);

      const topNetwork = networks[0];
      const additionalNetworkDataValue =
        topNetwork.count + (topNetwork.count === 1 ? " scene" : " scenes");
      const linkToNetwork = `/studios/${
        topNetwork.data.id
      }/scenes?c=("type":"performers","value":("items":%5B("id":"${
        performer.id
      }","label":"${encodeURIComponent(
        performer.name
      )}")%5D,"excluded":%5B%5D),"modifier":"INCLUDES")`;

      // Don't return the network unless it is different from the top studio.
      if (topNetwork.data.id !== topStudio.data.id) {
        itemTopNetworkOn = (
          <DetailItem
            collapsed={props.collapsed}
            id="top-network"
            title="Top Network"
            value={<a href={linkToNetwork}>{topNetwork.data.name}</a>}
            wide={true}
            additionalData={{
              id: "top-network-scenes",
              value: additionalNetworkDataValue,
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
        title="Top Studio"
        value={<a href={linkToStudio}>{topStudio.data.name}</a>}
        wide={true}
        additionalData={{
          id: "top-studio-scenes",
          value: additionalDataValue,
        }}
      />
      {itemTopNetworkOn}
    </>
  );
};

export default ItemTopStudio;

interface ItemTopStudioProps {
  /** The `findStudios` data object returned from the unfiltered GQL query. */
  allStudiosQueryResult: FindStudiosResultType;
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: PropsPerformerDetailsPanelDetailGroup["collapsed"];
  /** The current Stash performer. */
  performer: Performer;
  /** The plugin config data. */
  pluginConfig: PDEFinalConfigMap;
  /** The `findScenes` data object returned from the GQL query. */
  scenesQueryResult: FindScenesResultType;
}

interface IstudioCount {
  count: number;
  data: Studio;
}
