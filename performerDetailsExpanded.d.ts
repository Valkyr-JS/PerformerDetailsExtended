interface PerformerDetailsExpandedConfigResult extends ConfigResult {
  plugins: { performerLibraryMeta: PerformerDetailsExpandedConfigMap };
}

interface PerformerDetailsExpandedConfigMap {
  mostWorkedWithGendered: boolean;
}
