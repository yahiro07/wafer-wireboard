import { store } from "@/central/store";

export const SightDraggingCover = () => {
  const { draggingCoverVisible } = store.useSnapshot();
  return (
    draggingCoverVisible && <div className="absolute-full cursor-move flex-c" />
  );
};
