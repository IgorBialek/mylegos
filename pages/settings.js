import SettingsList from "../components/Global/SettingsList";
import { withProtected } from "../src/hook/route";

function Settings(props) {
  return <SettingsList></SettingsList>;
}

export default withProtected(Settings);
