import "./style.css";
import "mofur/ax-ui/utility-classes.css";
import { mountAppRoot } from "mofur/ax-react";
import { RoundButton } from "@/components/RoundButton";

const App = () => {
  return (
    <div>
      <RoundButton>A</RoundButton>
    </div>
  );
};

mountAppRoot(<App />);
