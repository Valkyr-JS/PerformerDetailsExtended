(function () {
  const PluginApi = (window as any).PluginApi as IPluginApi;

  PluginApi.Event.addEventListener("stash:location", (e) =>
    console.log("Page Changed", e)
  );
})();
