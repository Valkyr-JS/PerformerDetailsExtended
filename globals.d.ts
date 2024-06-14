declare interface Window {
  PluginApi: IPluginApi;
}

interface IPluginApi {
  React: typeof React;
  ReactDOM: typeof ReactDOM;
  GQL: {
    useFindPerformerQuery({ variables: { id: number } }): {
      data: {
        findPerformer: {
          scenes: StashGQLScene[];
        };
      };
    };
    useFindScenesQuery(args: StashGQLQueryFindScenes): {
      data: { findScenes: StashGQLFindScenesResultType };
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
  components: Record<string, React.FC<any>>;
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

interface PatchableComponents {
  after: (
    target: "PerformerDetailsPanel.DetailGroup",
    fn: (
      props: PropsPerformerDetailsPanelDetailGroup
    ) => React.Fc<PropsPerformerDetailsPanelDetailGroup>
  ) => void;
  before: (
    target: "PerformerDetailsPanel.DetailGroup",
    fn: (
      props: PropsPerformerDetailsPanelDetailGroup
    ) => React.Fc<PropsPerformerDetailsPanelDetailGroup>
  ) => void;
  instead: (
    target: "PerformerDetailsPanel.DetailGroup",
    fn: (
      props: PropsPerformerDetailsPanelDetailGroup
    ) => React.Fc<PropsPerformerDetailsPanelDetailGroup>
  ) => void;
}

interface PropsPerformerDetailsPanelDetailGroup
  extends React.PropsWithChildren {
  collapsed: boolean;
  fullWidth: boolean;
  performer: StashGQLPerformer;
}

/* -------------------------------------------------------------------------- */
/*                                  Stash GQL                                 */
/* -------------------------------------------------------------------------- */

interface StashGQLMovie {}
interface StashGQLPerformer {
  alias_list: string[string];
  created_at: Date;
  favorite: boolean;
  gallery_count: number;
  id: string;
  ignore_auto_tag: boolean;
  image_count: number;
  movie_count: number;
  movies: StashGQLMovie[];
  performer_count: number;
  name: string;
  scene_count: number;
  scenes: StashGQLScene[];
  stash_ids: StashGQLStashID[];
  tags: StashGQLTag[];
  updated_at: Date;

  birthdate?: string;
  career_length?: string;
  country?: string;
  disambiguation?: string;
  ethnicity?: string;
  eye_color?: string;
  circumcised?: StashGQLCircumisedEnum;
  death_date?: string;
  details?: string;
  fake_tits?: string;
  gender?: StashGQLGender;
  hair_color?: string;
  height_cm?: number;
  image_path?: string;
  instagram?: string;
  measurements?: string;
  o_counter?: number;
  piercings?: string;
  penis_length?: number;
  rating100?: number;
  tattoos?: string;
  twitter?: string;
  url?: string;
  weight?: number;
}

interface StashGQLScene {
  /** Formatted YYYY-MM-DD */
  date: string;
  performers: StashGQLPerformer[];
  studio: StashGQLStudio;
  tags: StashGQLTag[];
}

interface StashGQLStashID {
  endpoint: string;
  stash_id: string;
}

interface StashGQLStudio {
  id: string;
  name: string;
  parent_studio?: StashGQLStudio;
}

interface StashGQLTag {
  id: string;
  name: string;
}

enum StashGQLCircumisedEnum {
  CUT = 0,
  UNCUT,
}

type StashGQLGenderEnum =
  | "MALE"
  | "FEMALE"
  | "TRANSGENDER_MALE"
  | "TRANSGENDER_FEMALE"
  | "INTERSEX"
  | "NON_BINARY";

type StashGQLSortDirectionEnum = "ASC" | "DESC";

/* -------------------------------------------------------------------------- */
/*                              Stash GQL Queries                             */
/* -------------------------------------------------------------------------- */

interface StashGQLQueryFindScenes {
  variables: {
    filter?: StashGQLFindFilterType;
    scene_filter?: StashGQLSceneFilterType;
  };
}

interface StashGQLFindFilterType {
  direction?: StashGQLSortDirectionEnum;
  page?: number;
  /** Use `per_page = -1` to indicate all results. Defaults to 25. */
  per_page?: number;
  q?: string;
  sort?: string;
}

interface StashGQLSceneFilterType {
  /** Filter to only include scenes with these performers. */
  performers: StashGQLMultiCriterionInput;
}

interface StashGQLMultiCriterionInput {
  modifier: StashGQLCriterionModifier;
  value: string;
  excludes?: string;
}

type StashGQLCriterionModifier =
  | "EQUALS"
  | "NOT_EQUALS"
  | "GREATER_THAN"
  | "LESS_THAN"
  | "IS_NULL"
  | "NOT_NULL"
  | "INCLUDES_ALL"
  | "INCLUDES"
  | "EXCLUDES"
  | "MATCHES_REGEX"
  | "NOT_MATCHES_REGEX"
  | "BETWEEN"
  | "NOT_BETWEEN";

interface StashGQLFindScenesResultType {
  count: number;
  /** The total duration in seconds. */
  duration: number;
  /** The total file size in bytes. */
  filesize: number;
  scenes: StashGQLScene[];
}
