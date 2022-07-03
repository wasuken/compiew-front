import React, { useRef, useState, ChangeEventHandler } from "react";
import FolderTree from "react-folder-tree";
import logo from "./logo.svg";
import "./App.css";
import { useHooks, genDataRoot } from "./usehook"

function App() {
  const [uploadFile, setUploadFile] = useState<string>("");
  const { handleFiles, filepathes, handleParseFromUrl, clearFilepathes } =
    useHooks();
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
        <h2 className="title">Util</h2>
        <div>
          <button onClick={() => clearFilepathes()}>clear</button>
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
