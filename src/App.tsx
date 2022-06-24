import React, { useRef, useState, ChangeEventHandler } from "react";
import FolderTree from "react-folder-tree";
import logo from "./logo.svg";
import "./App.css";
import * as pako from "pako";
import untar from "js-untar";
import { Zlib as Unzip } from "zlibjs/bin/unzip.min";
import { isUint8Array } from "util/types";

function parseGZip(
  a: ArrayBuffer,
  setFilepathes: (v: string[]) => void
): string[] {
  untar(pako.inflate(a).buffer).then((files) =>
    setFilepathes(files.map((f) => f.name))
  );
}
function parseZip(
  a: ArrayBuffer,
  setFilepathes: (v: string[]) => void
): string[] {
  let zip = new Unzip.Unzip(new Uint8Array(a));
  setFilepathes(zip.getFilenames());
}

const useHooks = () => {
  const [filepathes, setFilepathes] = useState<string[]>([]);
  const handleFiles: ChangeEventHandler<HTMLInputElement> = (e) => {
    let reader: FileReader = new FileReader();
    const files = e.currentTarget.files;
    if (!files || files?.length <= 0) return;

    const file = files[0];
    reader.readAsArrayBuffer(file);
    const ext = file.name.split(".").slice(-1)[0];
    const f = ext === "zip" ? parseZip : parseGZip;
    reader.onload = () => {
      f(reader.result, setFilepathes);
    };
  };
  const handleParseFromUrl = (url: string) => {
    const uurl = url.split("?")[0];
    const ext = uurl.split(".").slice(-1)[0];
    const f = ext === "zip" ? parseZip : parseGZip;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";
    xhr.send();

    xhr.addEventListener("load", function () {
      f(xhr.response);
    });
  };
  return { handleFiles, filepathes, handleParseFromUrl };
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

interface Node {
  name: string;
  children: Node[];
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
  const { handleFiles, filepathes, handleParseFromUrl } = useHooks();
  const [inputUrl, setInputUrl] = useState<string>("");

  return (
    <div>
      <div>
        <h2 className="title">File Input</h2>
        <div>
          <input type="file" onChange={handleFiles} />
        </div>
      </div>
      <div>
        <h2 className="title">URL Input</h2>
        <div>
          <input
            type="url"
            placeholder="zip or gz file url"
            onChange={(e) => setInputUrl(e.target.value)}
          />
          <button onClick={() => handleParseFromUrl(inputUrl)}>read</button>
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
