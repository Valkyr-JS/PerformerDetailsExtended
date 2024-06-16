import { default as cx } from "classnames";
const { React } = window.PluginApi;

/** The detail group row. Identical to the native component, with an optional
 * ID. */
const DetailGroup = (props: DetailGroupProps) => {
  return (
    <div
      id={props.id}
      className={cx("detail-group", props.className)}
      children={props.children}
    />
  );
};

export default DetailGroup;

export interface DetailGroupProps extends React.PropsWithChildren {
  /** Additional classes to add to the component, beyond the native classes. */
  className?: HTMLDivElement["className"];
  /** Optional ID for scoping to the plugin and not affecting the native
   * component. */
  id?: string;
}
