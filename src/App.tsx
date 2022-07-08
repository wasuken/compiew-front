import React, { useRef, useState, ChangeEventHandler } from "react";
import FolderTree from "react-folder-tree";
import logo from "./logo.svg";
import "./App.css";
import { API_URL, useHooks, genDataRoot } from "./usehook";

function App() {
  const [uploadFile, setUploadFile] = useState<string>("");
  const { handleFiles, filepathes, handleParseFromUrl, clearFilepathes } =
    useHooks();
  const [inputUrl, setInputUrl] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [path, setPath] = useState<string>("");
  const [isViewContent, setIsViewContent] = useState<boolean>(false);
  const handleTest = (state, e) => {
    const { fpath, isDir } = state.nodeData;
    if (isDir === false) {
      const ffpath = fpath.substring(1);
      // TODO: 眠いので明日、ファイル単一参照APIへReqする
      fetch(`${API_URL}/zip/content?url='${inputUrl}'&path='${ffpath}'`)
        .then((res) => res.json())
        .then((js) => {
          setIsViewContent(true);
          setContent(js.content);
          setPath(ffpath);
        });
    }
  };

  return (
    <div>
      <div>
        <h2 className="title">File Input</h2>
        <p>内部のファイル一覧のみ確認可能</p>
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
      <div style={{ display: "flex", justifyContent: "flex-start", height: "100%" }}>
        <div style={{ width: "20vw", overflow: "scroll", height: "60vh" }}>
          <h2 className="title">Directory Tree</h2>
          {filepathes.length <= 0 ? (
            <div></div>
          ) : (
            <FolderTree
              showCheckbox={false}
              data={genDataRoot(filepathes)}
              onNameClick={handleTest}
            ></FolderTree>
          )}
        </div>
        {isViewContent ? (
          <div>
            <h3>{path}</h3>
            <pre
              style={{
                marginLeft: "10px",
                overflow: "scroll",
                height: "60vh",
                width: "70vw",
                wordWrap: "break-word",
              }}
            >
              {content}
            </pre>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default App;
