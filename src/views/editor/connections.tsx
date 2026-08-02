import { Connection } from "wafer-host/react";
import { store } from "@/model/store";

export const Connections = () => {
  const { wireItems } = store.useSnapshot();
  return (
    <>
      {wireItems.map((wire) => (
        <Connection
          key={`${wire.connectionKey}__${wire.hmrRevision ?? 0}`}
          source={wire.sourcePortKey}
          destination={wire.destinationPortKey}
        />
      ))}
    </>
  );
};
