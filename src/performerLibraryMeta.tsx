(function () {
  const { PluginApi } = window;
  const { GQL, React } = PluginApi;

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
   * Returns a string formatted as YYYY - YYYY. */
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

  /* -------------------------------------------------------------------------- */
  /*                               PluginApi patch                              */
  /* -------------------------------------------------------------------------- */

  /**
   * !`PerformerDetailsPanel` is not currently available as a PluginApi
   * !component. Have raised a request at
   * !https://github.com/stashapp/stash/issues/4880
   */
  PluginApi.patch.before("MainNavBar.UtilityItems", function (props: any) {
    const DEV_ONLY_PERFOMER_ID = 107;

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

    if (!!qPerformer.data && !!qScenes.data) {
      console.log("Performer data:", qPerformer);
      console.log("Scenes data:", qScenes);

      const pluginData = {
        libraryCareerLength: getLibraryCareerLength(
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
