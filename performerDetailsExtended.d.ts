/** Stash only creates config items when they are changed. By default they are
 * `undefined`. */
interface PDEConfigMap {
  /** By default the plugin adds the minimum amount of styling in order to blend
   * with the native Stash interface, as well as to be compatible with theme
   * plugins. When enabled, these additional styles improve the layout of the
   * performer details panel as a whole, though it may be incompatible with
   * theme plugins. */
  additionalStyling?: boolean;
  /** A comma-separated list of tag names that should be blacklisted from the
   * "Appears Most With" item. For example — compilations, pmv, remastered. */
  appearsMostWithTagsBlacklist?: string;
  /** When enabled, child tags of those in the blacklist will also be removed
   * from the "Appears Most With" blacklist. */
  appearsMostWithTagsBlacklistChildren?: boolean;
  /** Show a "Appears Most With" metadata item for each gender that the
   * performer has worked with. If false, only one item showing the Appears Most
   * With performer overall will be displayed. */
  appearsMostWithGendered?: boolean;
  /** The maximum number of results that are displayed as a performer's top
   * studios/networks/partners before they overflow to a hover popover. The
   * default value is 3. */
  maximumTops?: number;
  /** The minimum number of appearances a performer needs to have had with a
   * partner/studio/network in order to show the data. The default value is
   * 2. */
  minimumAppearances?: number;
  /** When enabled, Scene Timespan will display as "newest scene - oldest
   * scene", instead of the default "oldest scene - newest scene". */
  scenesTimespanReverse?: boolean;
  /** When enabled, the plugin data will always be displayed, irrelevant of
   * whether the performer details panel is collapsed or not. If disabled, it
   * will follow the same settings as Interface > Detail Page > Show all
   * details. */
  showWhenCollapsed?: boolean;
  /** Toggle displaying the "Top Network" item on or off. Default
   * is on. */
  topNetworkOn?: boolean;
  /** A comma-separated list of tag names that should be blacklisted from the
   * "Top Tags" item. For example — blowjob, missionary, girl/boy. */
  topTagsBlacklist?: string;
  /** When enabled, child tags of those in the blacklist will also be removed
   * from the "Top Tags" blacklist. */
  topTagsBlacklistChildren?: boolean;
  /** The number of tags to show under "Top Tags". Default is 3. */
  topTagsCount?: number;
  /** Toggle displaying the "Top Tags" item on or off. Default is on. */
  topTagsOn?: boolean;
}

interface PDEConfigResult extends ConfigResult {
  plugins: PluginsConfig;
  ui: UIConfig;
}

/** Matches `PDEConfigMap` but with required properties. */
interface PDEFinalConfigMap extends PDEConfigMap {
  additionalStyling: boolean;
  appearsMostWithTagsBlacklist: string;
  appearsMostWithTagsBlacklistChildren: boolean;
  appearsMostWithGendered: boolean;
  maximumTops: number;
  minimumAppearances: number;
  scenesTimespanReverse: boolean;
  showWhenCollapsed: boolean;
  topNetworkOn: boolean;
  topTagsBlacklist: string;
  topTagsBlacklistChildren: boolean;
  topTagsCount: number;
  topTagsOn: boolean;
}

interface PluginsConfig {
  PerformerDetailsExtended?: PDEConfigMap;
}

interface UIConfig {
  /** When enabled, this option will present expanded details while maintaining
   * a compact presentation. */
  compactExpandedDetails?: boolean;
  /** When enabled, all content details will be shown by default and each detail
   * item will fit under a single column. */
  showAllDetails?: boolean;
}
