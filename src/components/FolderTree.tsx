import { useState } from "react";
import { FaPlusSquare, FaMinusSquare, FaFolder, FaFile } from "react-icons/fa";
import { API_URL, useHooks, genDataRoot } from "../usehook";

interface FolderNode {
  name: string;
  checked: number;
  isOpen: boolean;
  children: FolderNode[] | undefined;
  fpath: string;
  isDir: boolean;
}

const FolderTree: React.FC<{
  data: FolderNode;
  handleFileClick: (tr: FolderNode) => void;
}> = ({ data, handleFileClick }) => {
  const [tree, setTree] = useState<FolderNode>(data);
  function toggle() {
    setTree({
      ...tree,
      isOpen: !tree.isOpen,
    });
  }
  if (!tree) return <>None.</>;
  return (
    <ul style={{ listStyleType: "none", padding: "0", marginLeft: "10px" }}>
      <li style={{ margin: "5px 0" }}>
        {tree.isDir && (
          <button
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              marginRight: "5px",
              fontSize: "1.1em",
            }}
            onClick={toggle}
          >
            {tree.isOpen ? <FaMinusSquare /> : <FaPlusSquare />}
          </button>
        )}
        {tree.isDir ? <FaFolder /> : <FaFile />}
        <button
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            marginLeft: "5px",
            fontSize: "1.1em",
          }}
          onClick={() => handleFileClick(tree)}
        >
          {tree.name}
        </button>

        {tree.isOpen &&
          tree.children &&
          tree.children.map((item, index) => (
            <FolderTree
              key={index}
              data={item}
              handleFileClick={handleFileClick}
            />
          ))}
      </li>
    </ul>
  );
};

export default FolderTree;
