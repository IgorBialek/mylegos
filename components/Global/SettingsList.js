import css from "./SettingsList.module.css";
import useAuth from "../../src/hook/auth";
import useMylegos from "../../src/hook/mylegos";
import useSettings from "../../src/hook/settings";

function memorySizeOf(obj) {
  var bytes = 0;

  function sizeOf(obj) {
    if (obj !== null && obj !== undefined) {
      switch (typeof obj) {
        case "number":
          bytes += 8;
          break;
        case "string":
          bytes += obj.length * 2;
          break;
        case "boolean":
          bytes += 4;
          break;
        case "object":
          var objClass = Object.prototype.toString.call(obj).slice(8, -1);
          if (objClass === "Object" || objClass === "Array") {
            for (var key in obj) {
              if (!obj.hasOwnProperty(key)) continue;
              sizeOf(obj[key]);
            }
          } else bytes += obj.toString().length * 2;
          break;
      }
    }
    return bytes;
  }

  function formatByteSize(bytes) {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KiB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MiB";
    else return (bytes / 1073741824).toFixed(3) + " GiB";
  }

  return formatByteSize(sizeOf(obj));
}

export default function SettingsList(props) {
  const auth = useAuth();
  const mylegos = useMylegos();
  const settings = useSettings();

  const { logout } = auth;
  const { SetItemsList } = mylegos;

  function handleLogout() {
    SetItemsList([]);
    logout();
  }
  return (
    <div className={css.container}>
      <div className={css.size}>
        <p>Space left:</p>
        <p className={css.secretContainer}>
          {(
            100 -
            (parseFloat(memorySizeOf(mylegos.itemsList)) / 1024) * 100
          ).toFixed(2)}
          %
        </p>
      </div>
      <div className={css.colors}>
        <p>Main color:</p>
        <input
          type="color"
          value={localStorage.mainColor}
          onChange={(e) => {
            settings.setMainColor(e.target.value);
          }}
        ></input>
      </div>
      <div className={css.colors}>
        <p>Accent color:</p>
        <input
          type="color"
          value={localStorage.accentColor}
          onChange={(e) => {
            settings.setAccentColor(e.target.value);
          }}
        ></input>
      </div>
      <div className={css.db}>
        <div
          className={`${css.save} hover2`}
          onClick={() => {
            settings.save();
          }}
        >
          <p>Save</p>
        </div>
        <div
          className={`${css.save} hover2`}
          onClick={() => {
            settings.load();
          }}
        >
          <p>Load</p>
        </div>
      </div>
      <div className={`${css.logout} hover2`} onClick={handleLogout}>
        <p>Logout</p>
      </div>
    </div>
  );
}
