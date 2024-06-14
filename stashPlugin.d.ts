interface Window {
  PluginApi: IPluginApi;
}

interface IPluginApi {
  React: typeof React;
  ReactDOM: typeof ReactDOM;
  GQL: {
    useFindPerformerQuery(args: { variables: QueryFindPerformerArgs }): {
      data: {
        findPerformer: Query["findPerformer"];
      };
    };
    useFindScenesQuery(args: { variables: QueryFindScenesArgs }): {
      data: { findScenes: Query["findScenes"] };
    };
  };
  Event: {
    addEventListener: (
      event: string,
      callback: (e: CustomEvent) => void
    ) => void;
  };
  libraries: {
    ReactRouterDOM: {
      Link: React.FC<any>;
      Route: React.FC<any>;
      NavLink: React.FC<any>;
    };
    Bootstrap: {
      Button: React.FC<any>;
      Nav: React.FC<any> & {
        Link: React.FC<any>;
      };
    };
    FontAwesomeSolid: {
      faEthernet: any;
    };
    Intl: {
      FormattedMessage: React.FC<any>;
    };
  };
  loadableComponents: any;
  components: StashPluginComponents;
  utils: {
    NavUtils: any;
    loadComponents: any;
  };
  hooks: any;
  patch: PatchableComponents;
  register: {
    route: (path: string, component: React.FC<any>) => void;
  };
}

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

interface StashPluginComponents {
  "PerformerDetailsPanel.DetailGroup": (
    props: PropsPerformerDetailsPanelDetailGroup
  ) => React.JSX.Element;
}

interface PatchableComponents {
  after: (
    component: "PerformerDetailsPanel.DetailGroup",
    fn: (props: PropsPerformerDetailsPanelDetailGroup) => React.JSX.Element[]
  ) => void;
  before: (
    component: "PerformerDetailsPanel.DetailGroup",
    fn: (props: PropsPerformerDetailsPanelDetailGroup) => React.JSX.Element[]
  ) => void;
  instead: (
    component: "PerformerDetailsPanel.DetailGroup",
    fn: (props: PropsPerformerDetailsPanelDetailGroup) => React.JSX.Element[]
  ) => void;
}

interface PropsPerformerDetailsPanelDetailGroup
  extends React.PropsWithChildren {
  collapsed: boolean;
  fullWidth: boolean;
  performer: Performer;
}
