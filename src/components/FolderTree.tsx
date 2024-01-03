import { useState } from "react";
interface FolderNode {
  name: string;
  checked: number;
  isOpen: boolean;
  children: FolderNode[] | undefined;
  fpath: string;
  isDir: boolean;
}

const FolderTree: React.FC<{ data: FolderNode }> = ({ data }) => {
  const [tree, setTree] = useState<FolderNode>(data);
  function toggle() {
    setTree({
      ...tree,
      isOpen: !tree.isOpen,
    });
  }
  console.log(data, tree);
  if (!tree) return <>None.</>;
  return (
    <ul style={{ listStyleType: "none", padding: "0", marginLeft: "10px" }}>
      <li style={{ margin: "5px 0" }}>
        {tree.isDir && (
          <button onClick={toggle}>{tree.isOpen ? "[-] " : "[+] "}</button>
        )}
        {tree.name}
        {tree.isOpen &&
          tree.children &&
          tree.children.map((item, index) => (
            <FolderTree key={index} data={item} />
          ))}
      </li>
    </ul>
  );
};

export default FolderTree;
