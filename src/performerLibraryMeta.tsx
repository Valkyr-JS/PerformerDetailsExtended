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
          <DetailItem {...itemProps} />
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
  PluginApi.patch.after("PerformerDetailsPanel", (props: any) => {
    const { data } = GQL.useFindPerformerQuery({
      variables: {
        id: 107, // ! Hardcoded for dev, should get from `PerformerDetailsPanel` props
      },
    });

    const libraryCareerLengthItem = {
      id: "plugin-lib-career",
      title: "Library Career Length",
      value: getLibraryCareerLength(data.findPerformer.scenes),
    };

    const detailGroupItems = [libraryCareerLengthItem];

    return [
      {
        children: (
          <>
            {props.children}
            <DetailGroup items={detailGroupItems} />
          </>
        ),
      },
    ];
  });
})();
