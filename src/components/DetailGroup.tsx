const { React } = window.PluginApi;

/** The detail group row. Identical to the native component, with an optional
 * ID. */
const DetailGroup = (props: DetailGroupProps) => {
  return (
    <div id={props.id} className="detail-group" children={props.children} />
  );
};

export default DetailGroup;

export interface DetailGroupProps extends React.PropsWithChildren {
  /** Optional ID for scoping to the plugin and not affecting the native
   * component. */
  id?: string;
}
