/** Stash only creates config items when they are changed. By default they are
 * `undefined`. */
interface PDEConfigMap {
  /** The number of tags to show under "Most Common Tags". Default is 3. */
  mostCommonTagsCount?: number;
  /** Toggle displaying the "Most Common Tags" item on or off. Default is on. */
  mostCommonTagsOn?: boolean;
  /** Toggle displaying the "Most Featured On (Network)" item on or off. Default
   * is on. */
  mostFeaturedNetworkOn?: boolean;
  /** Show a "Most Worked With" metadata item for each gender that the performer
   * has worked with. If false, only one item showing the most worked with
   * performer overall will be displayed. */
  mostWorkedWithGendered?: boolean;
  /** When enabled, the plugin data will be displayed whether the performer
   * details are collapsed or not. If disabled, it will follow the same settings
   * as Interface > Detail Page > Show all details. */
  showWhenCollapsed?: boolean;
}

interface PDEConfigResult extends ConfigResult {
  plugins: PluginsConfig;
  ui: UIConfig;
}

/** Matches `PDEConfigMap` but with required properties. */
interface PDEFinalConfigMap extends PDEConfigMap {
  mostCommonTagsCount: number;
  mostCommonTagsOn: boolean;
  mostFeaturedNetworkOn: boolean;
  mostWorkedWithGendered: boolean;
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
