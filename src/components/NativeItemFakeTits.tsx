import { PropsPerformerDetailsPanelDetailGroup } from "@pluginTypes/stashPlugin";
import DetailItem from "./DetailItem";

const { React } = window.PluginApi;

/** Replacement for the native "Fake Tits" item component. */
const NativeItemFakeTits: React.FC<NativeItemFakeTitsProps> = (props) => {
  return (
    <DetailItem
      collapsed={props.collapsed}
      id={props.id}
      title={props.title}
      value={props.value}
      wide={props.fullWidth}
    />
  );
};

export default NativeItemFakeTits;

interface NativeItemFakeTitsProps {
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: PropsPerformerDetailsPanelDetailGroup["collapsed"];
  /** Identifies whether to treat the item as including long text that requires
   * more room than native items. */
  fullWidth: boolean;
  /** The unique identifier for the item. */
  id: string;
  /** Replaces the "Fake Tits" heading in the native Stash interface with the
   * provided text. */
  title: string;
  /** The value of the item as displayed in the UI. */
  value: Performer["fake_tits"];
}
