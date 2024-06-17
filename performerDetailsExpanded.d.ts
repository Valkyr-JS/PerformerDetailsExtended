interface PerformerDetailsExpandedConfigResult extends ConfigResult {
  plugins: { performerLibraryMeta: PerformerDetailsExpandedConfigMap };
}

interface PerformerDetailsExpandedConfigMap {
  /** The number of tags to show under "Most Common Tags". Default is 3. */
  mostCommonTagsCount: number;
  /** Show a "Most Worked With" metadata item for each gender that the performer
   * has worked with. If false, only one item showing the most worked with
   * performer overall will be displayed. */
  mostWorkedWithGendered: boolean;
}
