import "./page.css";
import "beams/ax-ui/utility-classes.css";
//
import { mountAppRoot } from "beams/ax-react/mount-app-root";
import { useEffect } from "react";
import { CreditsPanel } from "@/sections/credits-panel";
import { PickerColumn } from "@/sections/picker-column";
import { hostSystem } from "@/store/store";
import { EditField } from "./sections/edit-field";

const PageRoot = () => {
  return (
    <div className="w-dvw h-dvh bg-gray-700 flex-h">
      <PickerColumn />
      <EditField />
      {false && <CreditsPanel />}
    </div>
  );
};

const App = () => {
  useEffect(hostSystem.setupLifecycle, []);
  return <PageRoot />;
};

mountAppRoot(<App />);
