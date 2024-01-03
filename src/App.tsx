import React, { useRef, useState, ChangeEventHandler } from "react";
import logo from "./logo.svg";
import "./App.css";
import { API_URL, useHooks, genDataRoot } from "./usehook";
import FolderTree from "./components/FolderTree";

function App() {
  const [uploadFile, setUploadFile] = useState<string>("");
  const { handleFiles, filepathes, handleParseFromUrl, clearFilepathes } =
    useHooks();
  const [inputUrl, setInputUrl] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [path, setPath] = useState<string>("");
  const [isViewContent, setIsViewContent] = useState<boolean>(false);
  const handleFileClick = function (tr: FolderNode) {
    const { fpath, isDir } = tr;
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
  const handleClear = () => {
    clearFilepathes();
    setInputUrl("");
    setContent("");
    setPath("");
    setIsViewContent(false);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          height: "100%",
          width: "100%",
        }}
      >
        <div style={{ width: "20vw", height: "100vh" }}>
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
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
              />
              <button onClick={() => handleParseFromUrl(inputUrl)}>read</button>
            </div>
          </div>
          <div>
            <h2 className="title">Util</h2>
            <div>
              <button onClick={handleClear}>clear</button>
            </div>
          </div>
          <h2 className="title">Directory Tree</h2>
          {filepathes.length <= 0 ? (
            <div></div>
          ) : (
            <div style={{ overflow: "scroll" }}>
              <FolderTree
                data={genDataRoot(filepathes)}
                handleFileClick={handleFileClick}
              />
            </div>
          )}
        </div>
        <div style={{ width: "75vw" }}>
          {isViewContent ? (
            <div>
              <h3>{path}</h3>
              <pre
                style={{
                  marginLeft: "10px",
                  overflow: "scroll",
                  height: "100vh",
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
    </div>
  );
}

export default App;
