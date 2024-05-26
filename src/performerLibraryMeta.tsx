(function () {
  const { PluginApi } = window;
  const { React } = PluginApi;

  /**
   * !`PerformerDetailsPanel` is not currently available as a PluginApi
   * !component. Have raised a request at
   * !https://github.com/stashapp/stash/issues/4880
   */
  PluginApi.patch.after("PerformerDetailsPanel", (props: any) => {
    return [
      {
        children: (
          <>
            {props.children}
            <div>Performer library meta</div>
          </>
        ),
      },
    ];
  });
})();
