interface PerformerDetailsExpandedConfigResult extends ConfigResult {
  plugins: { PerformerDetailsExtended: PerformerDetailsExpandedConfigMap };
}

/** Stash only creates config items when they are changed. By default they are
 * `undefined`. */
interface PerformerDetailsExpandedConfigMap {
  /** The number of tags to show under "Most Common Tags". Default is 3. */
  mostCommonTagsCount?: number;
  /** Show a "Most Worked With" metadata item for each gender that the performer
   * has worked with. If false, only one item showing the most worked with
   * performer overall will be displayed. */
  mostWorkedWithGendered?: boolean;
}

/** Matches `PerformerDetailsExpandedConfigMap` but with required properties. */
interface PerformerDetailsExpandedFinalConfigMap {
  /** The number of tags to show under "Most Common Tags". Default is 3. */
  mostCommonTagsCount: number;
  /** Show a "Most Worked With" metadata item for each gender that the performer
   * has worked with. If false, only one item showing the most worked with
   * performer overall will be displayed. */
  mostWorkedWithGendered: boolean;
}
