declare type initComponent<T> = (React: typeof globalThis.React) => React.FC<T>;

declare type createItemProps<T> = (
  /** The object containing specific arguments for the function. */
  args: T,
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: boolean,
  /** The React instance, if TSX is required in the output value prop. */
  React?: typeof globalThis.React
) => DetailItemProps;
