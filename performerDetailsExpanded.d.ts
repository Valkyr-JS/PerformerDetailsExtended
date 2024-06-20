/** Stash only creates config items when they are changed. By default they are
 * `undefined`. */
interface PDEConfigMap {
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
  /** When enabled, the plugin data will always be displayed, irrelevant of
   * whether the performer details panel is collapsed or not. If disabled, it
   * will follow the same settings as Interface > Detail Page > Show all
   * details. */
  showWhenCollapsed?: boolean;
  /** Toggle displaying the "Top Network" item on or off. Default
   * is on. */
  topNetworkOn?: boolean;
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
  appearsMostWithGendered: boolean;
  maximumTops: number;
  minimumAppearances: number;
  showWhenCollapsed: boolean;
  topNetworkOn: boolean;
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
