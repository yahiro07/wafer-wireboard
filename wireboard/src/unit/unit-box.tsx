import { UnitItem } from "@/model/types";
import { SlotCardBox } from "@/unit/unit-box-base";
import { PivotUnitBox } from "@/unit/unit-box-pivots";
import {
  KeyboardSystemPortBox,
  SpeakerSystemPortBox,
} from "@/unit/unit-box-system-ports";
import {
  WrapMixEmitterSlotCardBox,
  WrapMixReceiverSlotCardBox,
} from "@/unit/unit-box-warp-mix";

export const UnitBoxRoot = ({
  item,
  wireVertical,
}: {
  item: UnitItem;
  wireVertical: boolean;
}) => {
  if (item.unitId === "builtInKeyboard") {
    return <KeyboardSystemPortBox key={item.unitId} unit={item} />;
  } else if (item.unitId === "builtInPreOutput") {
    return <SpeakerSystemPortBox key={item.unitId} unit={item} />;
  } else if (item.catalogKey === "warpMixReceiver") {
    return <WrapMixReceiverSlotCardBox key={item.unitId} unitItem={item} />;
  } else if (item.catalogKey === "warpMixEmitter") {
    return <WrapMixEmitterSlotCardBox key={item.unitId} unitItem={item} />;
  } else if (
    item.catalogKey === "builtInVolume" ||
    item.catalogKey === "builtInNoteHub"
  ) {
    return <PivotUnitBox key={item.unitId} unitItem={item} />;
  } else {
    return (
      <SlotCardBox
        key={item.unitId}
        unitItem={item}
        wireVertical={wireVertical}
      />
    );
  }
};
