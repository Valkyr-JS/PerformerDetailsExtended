interface Window {
  PluginApi: IPluginApi;
}

interface IPluginApi {
  React: typeof React;
  ReactDOM: typeof ReactDOM;
  GQL: {
    useConfigurationQuery(): { data: { configuration: ConfigResult } };
    useFindPerformerQuery(args: { variables: QueryFindPerformerArgs }): {
      data: {
        findPerformer: Query["findPerformer"];
      };
    };
    useFindScenesQuery(args: { variables: QueryFindScenesArgs }): {
      data: { findScenes: Query["findScenes"] };
    };
    useFindStudiosQuery(args: { variables: QueryFindStudiosArgs }): {
      data: { findStudios: Query["findStudios"] };
    };
    useFindTagsQuery(args: { variables: QueryFindTagsArgs }): {
      data: { findTags: Query["findTags"] };
    };
    useStatsQuery(): { data: { stats: StatsResultType } };
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
  HoverPopover: (props: IHoverPopover) => React.JSX.Element;
  "PerformerDetailsPanel.DetailGroup": (
    props: PropsPerformerDetailsPanelDetailGroup
  ) => React.JSX.Element;
  SceneCard: (props: ISceneCardProps) => React.JSX.Element;
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

interface IHoverPopover extends React.PropsWithChildren {
  enterDelay?: number;
  leaveDelay?: number;
  content: JSX.Element[] | JSX.Element | string;
  className?: string;
  placement?: "top" | "right" | "bottom" | "left";
  onOpen?: () => void;
  onClose?: () => void;
  target?: React.RefObject<HTMLElement>;
}

interface ISceneCardProps {
  scene: GQL.SlimSceneDataFragment;
  containerWidth?: number;
  previewHeight?: number;
  index?: number;
  queue?: SceneQueue;
  compact?: boolean;
  selecting?: boolean;
  selected?: boolean | undefined;
  zoomIndex?: number;
  onSelectedChanged?: (selected: boolean, shiftKey: boolean) => void;
}
