import {
  BiInfoCircle,
  BiSolidLeftArrow,
  BiSolidRightArrow,
} from "react-icons/bi";
import { BsFillSpeakerFill, BsPlayFill } from "react-icons/bs";
import { CgChevronDown, CgSpinnerTwoAlt } from "react-icons/cg";
import { FaGithub, FaList } from "react-icons/fa";
import { HiBarsArrowDown, HiQueueList } from "react-icons/hi2";
import { IoIosPause } from "react-icons/io";
import { IoCloseSharp, IoShareSocial } from "react-icons/io5";
import { LuRotateCcwSquare, LuServer } from "react-icons/lu";
import { MdRestartAlt } from "react-icons/md";
import { PiLightningDuotone, PiPianoKeysFill } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  TbAntenna,
  TbArrowBadgeUp,
  TbNavigationFilled,
  TbSettings,
  TbZoom,
} from "react-icons/tb";
import { VscGripper, VscRadioTower } from "react-icons/vsc";

export const Icons = {
  Play: BsPlayFill,
  Grip: VscGripper,
  DeleteBin: RiDeleteBin6Line,
  ChevronDown: CgChevronDown,
  Speaker: BsFillSpeakerFill,
  Piano: PiPianoKeysFill,
  Info: BiInfoCircle,
  Close: IoCloseSharp,
  Github: FaGithub,
  Share: IoShareSocial,
  Spinner: CgSpinnerTwoAlt,
  Settings: TbSettings,
  Pause: IoIosPause,
  Restart: MdRestartAlt,
  ServerStack: LuServer,
  Antenna: TbAntenna,
  Lightning: PiLightningDuotone,
  RadioTower: VscRadioTower,
  List: FaList,
  Zoom: TbZoom,
  RotateSquare: LuRotateCcwSquare,
  BarsArrow: HiBarsArrowDown,
};

export const IconsEx = {
  // ConnectorPortUp: LiaLocationArrowSolid,
  // ConnectorPortUp: BiSolidUpArrow,
  // ConnectorPortUp: FaAnglesUp,
  ConnectorPortUp: TbNavigationFilled,
  KeyboardOctaveShiftL: BiSolidLeftArrow,
  KeyboardOctaveShiftR: BiSolidRightArrow,
  SceneSwitcher: HiQueueList,
  KeyboardAutoTarget: TbArrowBadgeUp,
};
