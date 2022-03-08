import { createContext, useContext, useEffect, useState } from "react";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import useAuth from "./auth";

function hexToHSL(H) {
  // Convert hex to RGB first
  let r = 0,
    g = 0,
    b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
}

const settingsContext = createContext();

export default function useSettings() {
  return useContext(settingsContext);
}

export function SettingsProvider(props) {
  const db = getFirestore();
  const { user, error } = useAuth();
  const [type, setType] = useState("owned");
  const [editable, setEditable] = useState(false);
  const [mainColor, setMainColor] = useState("#003806");
  const [accentColor, setAccentColor] = useState("#ffffff");
  const [sorting, setSorting] = useState({ type: "Release date", asc: false });

  useEffect(() => {
    setMainColor(localStorage.mainColor ?? "#003806");
    setAccentColor(localStorage.accentColor ?? "#ffffff");
  }, []);

  useEffect(() => {
    if (user) {
      load();
    }
  }, [user]);

  useEffect(() => {
    let hsl = hexToHSL(mainColor);
    document.documentElement.style.setProperty("--hue", hsl.h);
    document.documentElement.style.setProperty("--saturation", hsl.s + "%");
    document.documentElement.style.setProperty("--light", hsl.l + "%");

    localStorage.mainColor = mainColor;
  }, [mainColor]);

  useEffect(() => {
    let hsl2 = hexToHSL(accentColor);
    document.documentElement.style.setProperty("--hue2", hsl2.h);
    document.documentElement.style.setProperty("--saturation2", hsl2.s + "%");
    document.documentElement.style.setProperty("--light2", hsl2.l + "%");

    localStorage.accentColor = accentColor;
  }, [accentColor]);

  useEffect(() => {
    if (user) {
      save();
    }
  }, [sorting]);

  //Saves settings to db
  const save = async () => {
    console.log({ mainColor, accentColor, sorting });
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          settings: { mainColor, accentColor, sorting },
        },
        { merge: true }
      );
    } catch (e) {
      console.log(e);
      alert("Error adding document: ", e.message);
    }
  };

  //Loads settings from database
  const load = async () => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setMainColor(docSnap.data().settings.mainColor ?? "#003806");
      setAccentColor(docSnap.data().settings.accentColor ?? "#ffffff");
      setSorting(
        docSnap.data().settings.sorting ?? { type: "Release date", asc: false }
      );
    } else {
      return;
    }
  };

  const value = {
    type,
    setType,
    mainColor,
    setMainColor,
    accentColor,
    setAccentColor,
    sorting,
    setSorting,
    editable,
    setEditable,
    save,
    load,
  };

  return <settingsContext.Provider value={value} {...props} />;
}
