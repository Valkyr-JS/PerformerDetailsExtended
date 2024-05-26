(function () {
  const { PluginApi } = window;
  const { GQL, React } = PluginApi;

  /* -------------------------------------------------------------------------- */
  /*                              DEVELOPMENT ONLY                              */
  /* -------------------------------------------------------------------------- */

  /* ------------------------ Get the current performer ----------------------- */

  /**
   * ! This should be able to be removed once the component can be properly
   * rendered and the current performer ID can be obtained from elsewhere.
   */

  let DEV_ONLY_PERFOMER_ID: number | null = null;

  PluginApi.Event.addEventListener("stash:location", (e) => {
    const pathing = e.detail.data.location.pathname.split("/");
    if (pathing.length > 2 && pathing[1] === "performers") {
      DEV_ONLY_PERFOMER_ID = +pathing[2];
    } else {
      DEV_ONLY_PERFOMER_ID = null;
    }
  });

  /* -------------------------------------------------------------------------- */
  /*                              React components                              */
  /* -------------------------------------------------------------------------- */

  /* ------------------------------ Detail group ------------------------------ */

  const DetailGroup = ({ items }: DetailGroupProps) => {
    return (
      <div id="plugin-performerLibraryMeta" className="detail-group">
        {items.map((itemProps) => (
          <DetailItem key={itemProps.id} {...itemProps} />
        ))}
      </div>
    );
  };

  interface DetailGroupProps {
    items: DetailItemProps[];
  }

  /* ------------------------------- Detail item ------------------------------ */

  const DetailItem = ({ id, title, value }: DetailItemProps) => {
    return (
      <div className={"detail-item " + id}>
        <span className={"detail-item-title " + id}>{title}</span>
        <span className={"detail-item-value " + id}>{value}</span>
      </div>
    );
  };

  interface DetailItemProps {
    id: string;
    title: string;
    value: string;
  }

  /* -------------------------------------------------------------------------- */
  /*                               Data formatting                              */
  /* -------------------------------------------------------------------------- */

  /** Get the performer's career length based on scenes in the user's library.
   * Returns a string formatted as "YYYY - YYYY". */
  const getLibraryCareerLength = (scenes: StashGQLScene[]) => {
    const dates = {
      oldest: scenes[0],
      latest: scenes[0],
    };

    scenes.forEach((sc) => {
      const scDate = new Date(sc.date);
      if (scDate < new Date(dates.oldest.date)) dates.oldest = sc;
      if (scDate > new Date(dates.latest.date)) dates.latest = sc;
    });

    const years = {
      oldest: dates.oldest.date.split("-")[0],
      latest: dates.latest.date.split("-")[0],
    };

    /**
     * TODO - Currently returns a string. Could be repurposed to return scene
     * data so that the oldest and latest scenes can be clicked through to.
     */
    return `${years.oldest} - ${years.latest}`;
  };

  /** Get the performer's most frequest scene partner based on scenes in the
   * user's library. Returns a string formatted as "Name (count)" */
  const getMostFrequentPartner = (
    scenes: StashGQLScene[],
    performerID: StashGQLPerformer["id"],
    gender?: StashGQLGenderEnum
  ) => {
    // Create an array of performer data from all scenes
    const partners: {
      count: number;
      gender: StashGQLPerformer["gender"];
      id: StashGQLPerformer["id"];
      name: StashGQLPerformer["name"];
    }[] = [];

    // Check each scene
    scenes.forEach((sc) => {
      // Check each performer in the scene
      sc.performers.forEach((pf) => {
        // Check this is not the featured performer
        if (pf.id !== performerID) {
          // Check if the performer already exists in the array
          const perfomersIndex = partners.findIndex(
            (ptnr) => ptnr.id === pf.id
          );

          if (perfomersIndex !== -1) {
            // Increase the performer count
            partners[perfomersIndex].count++;
          } else {
            // Add the performer to the array
            partners.push({
              id: pf.id,
              count: 1,
              gender: pf.gender,
              name: pf.name,
            });
          }
        }
      });
    });

    // Sort count from highest to lowest
    partners.sort((a, b) => b.count - a.count);

    if (typeof gender === "undefined") {
      // Return the performer with the highest overall count.
      return partners.length
        ? `${partners[0].name} (${partners[0].count})`
        : null;
    } else {
      // Else return the performer with the highest overall count of the
      // required gender.
      const genderedPartner = partners.find((ptnr) => ptnr.gender === gender);
      return genderedPartner
        ? `${genderedPartner.name} (${genderedPartner.count})`
        : null;
    }
  };

  /**
   * Get the most common tags in scenes the performer is featured in. Returns a
   * string formatted as "Tag name A (count), Tag name B (count)..." etc.
   */
  const getMostCommonTags = (scenes: StashGQLScene[], tagCount: number = 3) => {
    // Create an array of tag data from all scenes
    const tags: {
      count: number;
      id: StashGQLTag["id"];
      name: StashGQLTag["name"];
    }[] = [];

    // Check each scene
    scenes.forEach((sc) => {
      // Check each tag in the scene
      sc.tags.forEach((tag) => {
        // Check if the tag already exists in the array
        const tagIndex = tags.findIndex((t) => t.id === tag.id);

        if (tagIndex !== -1) {
          // Increase the tag count
          tags[tagIndex].count++;
        } else {
          // Add the tag to the array
          tags.push({
            id: tag.id,
            count: 1,
            name: tag.name,
          });
        }
      });
    });

    // Sort count from highest to lowest
    tags.sort((a, b) => b.count - a.count);

    // Return the tags with the highest overall count, up to the tagCount
    if (tags.length) {
      const maxTags = tags.length < tagCount ? tags.length : tagCount;
      let tagString = "";
      for (let i = 0; i < maxTags; i++) {
        tagString +=
          (i === 0 ? "" : ", ") + `${tags[i].name} (${tags[i].count})`;
      }
      return tagString;
    } else {
      return null;
    }
  };

  /** Get the performer's most featured studio based on scenes in the user's
   * library. Returns a string formatted as "Studio (count)"  */
  const getMostFrequentStudio = (scenes: StashGQLScene[]) => {
    // Create an array of studio data from all scenes
    const studios: {
      count: number;
      id: StashGQLStudio["id"];
      name: StashGQLStudio["name"];
    }[] = [];

    // Check each scene
    scenes.forEach((sc) => {
      // Check if the scene studio already exists in the array
      const studiosIndex = studios.findIndex((st) => st.id === sc.studio.id);

      if (studiosIndex !== -1) {
        // Increase the studio's count
        studios[studiosIndex].count++;
      } else {
        studios.push({ id: sc.studio.id, count: 1, name: sc.studio.name });
      }
    });

    // Sort count from highest to lowest
    studios.sort((a, b) => b.count - a.count);

    console.log(studios);

    // Return the studio with the highest overall count
    return studios.length ? `${studios[0].name} (${studios[0].count})` : null;
  };

  /* -------------------------------------------------------------------------- */
  /*                               PluginApi patch                              */
  /* -------------------------------------------------------------------------- */

  /**
   * !`PerformerDetailsPanel` is not currently available as a PluginApi
   * !component. Have raised a request at
   * !https://github.com/stashapp/stash/issues/4880
   */
  PluginApi.patch.before("MainNavBar.UtilityItems", function (props: any) {
    const qPerformer = GQL.useFindPerformerQuery({
      variables: {
        id: DEV_ONLY_PERFOMER_ID,
      },
    });

    //@ts-ignore
    const qScenes = GQL.useFindScenesQuery({
      variables: {
        filter: { per_page: -1 },
        scene_filter: {
          performers: { modifier: "INCLUDES", value: DEV_ONLY_PERFOMER_ID },
        },
      },
    });

    if (!!qPerformer.data && !!qScenes.data && DEV_ONLY_PERFOMER_ID !== null) {
      console.log("Performer data:", qPerformer);
      console.log("Scenes data:", qScenes);

      const pluginData = {
        libraryCareerLength: getLibraryCareerLength(
          qScenes.data.findScenes.scenes
        ),
        mostFrequentPartner: getMostFrequentPartner(
          qScenes.data.findScenes.scenes,
          DEV_ONLY_PERFOMER_ID.toString()
        ),
        mostFrequentMalePartner: getMostFrequentPartner(
          qScenes.data.findScenes.scenes,
          DEV_ONLY_PERFOMER_ID.toString(),
          "MALE"
        ),
        mostFrequentFemalePartner: getMostFrequentPartner(
          qScenes.data.findScenes.scenes,
          DEV_ONLY_PERFOMER_ID.toString(),
          "FEMALE"
        ),
        mostFrequentNonbinaryPartner: getMostFrequentPartner(
          qScenes.data.findScenes.scenes,
          DEV_ONLY_PERFOMER_ID.toString(),
          "NON_BINARY"
        ),
        mostCommonTags: getMostCommonTags(qScenes.data.findScenes.scenes, 5),
        mostFrequentStudio: getMostFrequentStudio(
          qScenes.data.findScenes.scenes
        ),
      };
      console.log("Performer Library Meta:", pluginData);
    }

    return [
      {
        children: <>{props.children}</>,
      },
    ];
  });
})();
