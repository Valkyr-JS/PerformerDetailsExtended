/** Stash only creates config items when they are changed. By default they are
 * `undefined`. */
interface PDEConfigMap {
  /** The number of tags to show under "Top Tags". Default is 3. */
  topTagsCount?: number;
  /** Toggle displaying the "Top Tags" item on or off. Default is on. */
  topTagsOn?: boolean;
  /** Toggle displaying the "Top Network" item on or off. Default
   * is on. */
  topNetworkOn?: boolean;
  /** Show a "Appears Most With" metadata item for each gender that the performer
   * has worked with. If false, only one item showing the Appears Most With
   * performer overall will be displayed. */
  appearsMostWithGendered?: boolean;
  /** When enabled, the plugin data will always be displayed, irrelevant of
   * whether the performer details panel is collapsed or not. If disabled, it
   * will follow the same settings as Interface > Detail Page > Show all
   * details. */
  showWhenCollapsed?: boolean;
}

interface PDEConfigResult extends ConfigResult {
  plugins: PluginsConfig;
  ui: UIConfig;
}

/** Matches `PDEConfigMap` but with required properties. */
interface PDEFinalConfigMap extends PDEConfigMap {
  topTagsCount: number;
  topTagsOn: boolean;
  topNetworkOn: boolean;
  appearsMostWithGendered: boolean;
  showWhenCollapsed: boolean;
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
