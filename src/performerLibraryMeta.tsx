(function () {
  const { PluginApi } = window;
  const { React } = PluginApi;

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
  /*                               PluginApi patch                              */
  /* -------------------------------------------------------------------------- */

  /**
   * !`PerformerDetailsPanel` is not currently available as a PluginApi
   * !component. Have raised a request at
   * !https://github.com/stashapp/stash/issues/4880
   */
  PluginApi.patch.after("PerformerDetailsPanel", (props: any) => {
    const items: DetailItemProps[] = [];

    return [
      {
        children: (
          <>
            {props.children}
            <DetailGroup items={items} />
          </>
        ),
      },
    ];
  });
})();
