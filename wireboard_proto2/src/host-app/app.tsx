import { iife } from "beams/ax/object-utils";
import { mountAppRoot } from "beams/ax-react/mount-app-root";
import { useEffect, useState } from "react";
import { hostSystem } from "@/framework/host/host-system";
import { UnitBox } from "@/host-app/organisms/unit-box";
import { store } from "@/host-app/store";
import { WireLayer } from "@/host-app/wire-layer";

const App = () => {
  const [loading, setLoading] = useState(true);
  const { unitItems } = store.useSnapshot();

  useEffect(() => {
    iife(async () => {
      await hostSystem.waitPendingUnits();
      setLoading(false);
    });
  });

  return (
    <div className="w-dvw h-dvh flex-h">
      <div className="w-[200px] bd-red">{loading && "loading..."}</div>
      <div className="grow relative h-dvh bd-red isolate">
        <WireLayer unitItems={unitItems} />
        {unitItems.map((item) => (
          <div
            key={item.unitId}
            className="absolute z-10"
            style={{ left: item.position.x, top: item.position.y }}
          >
            <UnitBox
              unitId={item.unitId}
              unitTemplateFn={item.unitTemplateFn}
              pageUrl={item.pageUrl}
              destSpec={item.destSpec}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

mountAppRoot(<App />);
