import * as pako from "pako";
import untar from "js-untar";
import { Zlib as Unzip } from "zlibjs/bin/unzip.min";
import { isUint8Array } from "util/types";
import { useState } from "react";

export const API_URL = process.env.REACT_APP_API_URL;

function parseGZip(a: ArrayBuffer, setFilepathes: (v: string[]) => void) {
  untar(pako.inflate(a).buffer).then((files: string[]) => setFilepathes(files));
}
function parseZip(a: ArrayBuffer, setFilepathes: (v: string[]) => void) {
  let zip = new Unzip.Unzip(new Uint8Array(a));
  setFilepathes(zip.getFilenames());
}

export const useHooks = () => {
  const [filepathes, setFilepathes] = useState<string[]>([]);
  const handleFiles = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let reader: FileReader = new FileReader();
    const files = e.currentTarget.files;
    if (!files || files?.length <= 0) return;

    const file = files[0];
    reader.readAsArrayBuffer(file);
    const ext = file.name.split(".").slice(-1)[0];
    const f = ext === "zip" ? parseZip : parseGZip;
    reader.onload = () => {
      const rst = reader.result;
      if (rst instanceof ArrayBuffer) {
        f(rst, setFilepathes);
      }
    };
  };
  const handleParseFromUrl = (url: string) => {
    fetch(`${API_URL}/zipinfo?url=${url}`)
      .then((res) => res.json())
      .then((json) => {
        console.log("debug", genDataRoot(json.pathes))
        setFilepathes(json.pathes)
      });
  };
  const clearFilepathes = () => {
    setFilepathes([]);
  };
  return { handleFiles, filepathes, handleParseFromUrl, clearFilepathes };
};

class Node extends Map<string, Node | undefined> {}

function genTable(fps: string[]): Node {
  const f = (node: Node | undefined, keys: string[]) => {
    const key = keys[0];
    if (node instanceof Node) {
      if (keys.length === 1 && key.length > 0) {
        node.set(key, undefined);
      } else if (keys.length > 0) {
        let nnode: Node | undefined = new Node();
        if (node.has(key)) {
          nnode = node.get(key);
        } else {
          node.set(key, nnode);
        }
        f(nnode, keys.slice(1));
      }
    }
  };
  let tbl: Node = new Node();
  fps.forEach((fp) => {
    const sp = fp.split("/");
    f(tbl, sp);
  });
  return tbl;
}

export function genDataRoot(fps: string[]) {
  let tbl: Node = genTable(fps);
  const clickf = (path: string) => {
    return () => console.log(path);
  };
  const f = (tblParent: Node, pathes: string[]): FolderNode[] => {
    let rst: FolderNode[] = [];
    tblParent.forEach((v, k) => {
      let c = genDefaultChild(k);
      const cur_pathes = [...pathes, k];
      if (v instanceof Node) {
        c.children = f(v, cur_pathes);
        c.isDir = true;
      }else{
        c.isDir = false;
      }
      if (k.length > 0) {
        c.fpath = cur_pathes.join("/");
        rst.push(c);
      }
    });
    return rst;
  };
  let top = genDefaultChild("<root>");
  top.children = f(tbl, [""]);
  return top;
}

type FileClick = () => void;

interface FolderNode {
  name: string;
  checked: number;
  isOpen: boolean;
  children: FolderNode[] | undefined;
  fpath: string;
  isDir: boolean;
}

const genDefaultChild = (name: string): FolderNode => {
  return {
    name: name,
    checked: 0.5,
    isOpen: false,
    fpath: "",
    children: undefined,
    isDir: false,
  };
};
