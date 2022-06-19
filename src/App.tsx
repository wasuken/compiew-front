import React, { useRef, useState, ChangeEventHandler } from "react";
import FolderTree from "react-folder-tree";
import logo from "./logo.svg";
import "./App.css";
import * as pako from "pako";
import { isUint8Array } from "util/types";

const useHooks = () => {
  const [filepathes, setFilepathes] = useState<string[]>([]);
  const handleFiles: ChangeEventHandler<HTMLInputElement> = (e) => {
    let reader: FileReader = new FileReader();
    const files = e.currentTarget.files;
    if (!files || files?.length <= 0) return;

    reader.readAsArrayBuffer(files[0]);
    reader.onload = () => {
      const inf = pako.inflate(reader.result);
      const str = new TextDecoder().decode(inf).replaceAll(/\0+/gi, "\0");
      const fps = str
        .split("\n\0")
        .map((x) => x.split("\0")[0])
        .filter((x) => x.replaceAll(/\0+/gi, "").length >= 1);
      setFilepathes(fps);
    };
  };
  return { handleFiles, filepathes };
};

function genTable(fps: string[]) {
  const f = (obj: Object, keys: string) => {
    if (keys.length <= 0) {
      return;
    } else if (keys.length === 1 && keys[0].length > 0) {
      obj[keys[0]] = null;
    } else if (keys.length > 1) {
      let nobj = {};
      if (obj[keys[0]]) {
        nobj = obj[keys[0]];
      } else {
        obj[keys[0]] = nobj;
      }
      f(nobj, keys.slice(1));
    }
  };
  let tbl = {};
  fps.forEach((fp) => {
    const sp = fp.split("/");
    f(tbl, sp);
  });
  Object.keys(tbl).forEach((k) => {
    if (!tbl[k] || tbl[k] === null) {
      delete tbl[k];
    }
  });
  return tbl;
}

function genDataRoot(fps: string[]) {
  let tbl = genTable(fps);
  let data = {};
  const f = (parent: Object, tblParent: Object) => {
    return Object.keys(tblParent).map((k) => {
      let c = genDefaultChild(k);
      if (tblParent[k] && tblParent[k] !== null) {
        c.children = f(c, tblParent[k]);
      }
      return c;
    });
  };
  return f({}, tbl)[0];
}

const genDefaultChild = (name: string) => {
  return {
    name: name,
    checked: 0.5,
    isOpen: false,
  };
};

function App() {
  const [uploadFile, setUploadFile] = useState("");
  const { handleFiles, filepathes } = useHooks();

  return (
    <div>
      <div>
        <h2 className="title">File Input</h2>
        <div>
          <input type="file" onChange={handleFiles} />
          <button>read</button>
        </div>
      </div>
      <div>
        <h2 className="title">Directory Tree</h2>
        {filepathes.length <= 0 ? (
          <div></div>
        ) : (
          <FolderTree
            showCheckbox={false}
            data={genDataRoot(filepathes)}
          ></FolderTree>
        )}
      </div>
    </div>
  );
}

export default App;
