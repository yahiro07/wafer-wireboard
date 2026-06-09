import { mountAppRoot } from "mofur/ax-react";
import { RoundButton } from "wb-react-units";
import "wb-react-units/style.css";

const App = () => {
  return (
    <div>
      hello
      <RoundButton />
    </div>
  );
};
mountAppRoot(<App />);
