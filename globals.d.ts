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
  patch: {
    before: (target: string, fn: Function) => void;
    instead: (target: string, fn: Function) => void;
    after: (target: string, fn: Function) => void;
  };
  register: {
    route: (path: string, component: React.FC<any>) => void;
  };
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
  tags: StashGQLTags[];
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
}

interface StashGQLStashID {
  endpoint: string;
  stash_id: string;
}

interface StashGQLTags {}

enum StashGQLCircumisedEnum {
  CUT = 0,
  UNCUT,
}

enum StashGQLGenderEnum {
  MALE = 0,
  FEMALE,
  TRANSGENDER_MALE,
  TRANSGENDER_FEMALE,
  INTERSEX,
  NON_BINARY,
}
