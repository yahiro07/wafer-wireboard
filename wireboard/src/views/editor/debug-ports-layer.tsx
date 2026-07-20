import { store } from "@/model/store";

export const DebugPortsLayer = () => {
  const { portItems } = store.useSnapshot();
  return (
    <div className="absolute-full pointer-events-none">
      {Object.values(portItems).map((port) => (
        <div
          key={port.portKey}
          className="absolute"
          style={{
            left: port.position.x - 4,
            top: port.position.y - 4,
            width: 8,
            height: 8,
            border: "solid 1px blue",
            color: "blue",
            transform: "rotate(-30deg)",
          }}
        >
          {port.portKey}
        </div>
      ))}
    </div>
  );
};

export const DebugUnitPositionsLayer = () => {
  const { unitItems } = store.useSnapshot();
  return (
    <div className="absolute-full pointer-events-none">
      {Object.values(unitItems).map((unit) => (
        <div
          key={unit.unitId}
          className="absolute"
          style={{
            left: unit.position.x - 4,
            top: unit.position.y - 4,
            width: 8,
            height: 8,
            border: "solid 1px green",
            color: "green",
          }}
        >
          {unit.unitId}
        </div>
      ))}
    </div>
  );
};
