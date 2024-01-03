interface FolderNode {
  name: string;
  checked: number;
  isOpen: boolean;
  children: FolderNode[] | undefined;
  fpath: string;
  isDir: boolean;
}

const FolderTree: React.FC<{ data: FolderNode[] }> = ({ data }) => {
  return (
    <ul style={{ listStyleType: "none", padding: "0" }}>
      {data.map((item, index) => (
        <li key={index} style={{ margin: "5px 0" }}>
          {item.isDir && (
            <span onClick={() => toggle(item.fpath)}>
              {item.isOpen ? "[-] " : "[+] "}
            </span>
          )}
          {item.name}
          {item.isDir && item.isOpen && item.children && (
            <FolderTree data={item.children} toggle={item.isOpen} />
          )}
        </li>
      ))}
    </ul>
  );
};

export default FolderTree;
