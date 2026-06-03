import { mountAppRoot } from "beams/ax-react/mount-app-root";
import { domEditAreaId } from "@/host-app/common";
import { UnitBox } from "@/host-app/organisms/unit-box";
import { store } from "@/host-app/store";
import { WireLayer } from "@/host-app/wire-layer";

const App = () => {
  const { loading } = store.useSnapshot();
  const { unitItems } = store.useSnapshot();

  return (
    <div className="w-dvw h-dvh flex-h">
      <div className="w-[200px] bd-red">{loading && "loading..."}</div>
      <div className="grow relative h-dvh bd-red isolate" id={domEditAreaId}>
        {!loading && <WireLayer />}
        {unitItems.map((item) => (
          <UnitBox key={item.unitId} unitItem={item} />
        ))}
      </div>
    </div>
  );
};

mountAppRoot(<App />);
