import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileCode, FolderOpen, Download, Copy, Check, ChevronRight, Search, X } from "lucide-react";

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

const EXT_COLORS = {
  ".jsx": "text-cyan-600",
  ".js": "text-yellow-600",
  ".tsx": "text-blue-600",
  ".ts": "text-blue-500",
  ".css": "text-pink-600",
  ".py": "text-green-600",
  ".json": "text-amber-600",
  ".md": "text-slate-500",
  ".html": "text-orange-600",
  ".env": "text-violet-600",
  ".txt": "text-slate-400",
};

function getExtColor(path) {
  const ext = "." + path.split(".").pop();
  return EXT_COLORS[ext] || "text-slate-400";
}

function buildTree(files) {
  const root = {};
  files.forEach((f) => {
    const parts = f.path.split("/");
    let node = root;
    parts.forEach((part, i) => {
      if (i === parts.length - 1) {
        if (!node.__files__) node.__files__ = [];
        node.__files__.push(f);
      } else {
        if (!node[part]) node[part] = {};
        node = node[part];
      }
    });
  });
  return root;
}

function TreeNode({ name, node, depth, onSelect, selectedPath }) {
  const [open, setOpen] = useState(depth < 2);
  const dirs = Object.keys(node).filter((k) => k !== "__files__");
  const files = node.__files__ || [];

  return (
    <div>
      {name && (
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 w-full px-2 py-1.5 hover:bg-slate-100 transition-colors text-left"
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          data-testid={`folder-${name}`}
        >
          <ChevronRight size={12} className={`text-slate-400 transition-transform ${open ? "rotate-90" : ""}`} />
          <FolderOpen size={14} className="text-blue-600" />
          <span className="font-body text-xs font-semibold text-slate-700">{name}</span>
        </button>
      )}
      {open && (
        <>
          {dirs.sort().map((dir) => (
            <TreeNode key={dir} name={dir} node={node[dir]} depth={depth + 1} onSelect={onSelect} selectedPath={selectedPath} />
          ))}
          {files.map((f) => {
            const fileName = f.path.split("/").pop();
            const isSelected = selectedPath === f.path;
            return (
              <button
                key={f.path}
                onClick={() => onSelect(f.path)}
                data-testid={`file-${fileName}`}
                className={`flex items-center gap-1.5 w-full px-2 py-1.5 transition-colors text-left ${isSelected ? "bg-blue-50 border-r-2 border-blue-700" : "hover:bg-slate-50"
                  }`}
                style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}
              >
                <FileCode size={13} className={getExtColor(f.path)} />
                <span className={`font-mono text-xs ${isSelected ? "text-blue-700 font-semibold" : "text-slate-600"}`}>{fileName}</span>
                <span className="ml-auto font-mono text-[10px] text-slate-300">{(f.size / 1024).toFixed(1)}k</span>
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}

export default function CodeViewer() {
  const [files, setFiles] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(`${API}/code/files`)
      .then((r) => r.json())
      .then((data) => {
        setFiles(data.files || []);
        if (data.files?.length > 0) {
          const appJs = data.files.find((f) => f.path === "frontend/src/App.js");
          handleSelect(appJs ? appJs.path : data.files[0].path);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelect = (path) => {
    setSelectedPath(path);
    setContent("Loading...");
    fetch(`${API}/code/file?path=${encodeURIComponent(path)}`)
      .then((r) => r.json())
      .then((data) => setContent(data.content || data.error || ""))
      .catch(() => setContent("Failed to load file."));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    window.open(`${API}/code/download`, "_blank");
  };

  const tree = useMemo(() => buildTree(files), [files]);

  const filteredFiles = useMemo(() => {
    if (!searchQuery) return files;
    const q = searchQuery.toLowerCase();
    return files.filter((f) => f.path.toLowerCase().includes(q));
  }, [files, searchQuery]);

  const filteredTree = useMemo(() => buildTree(filteredFiles), [filteredFiles]);

  const lineCount = content ? content.split("\n").length : 0;

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-white">
        <p className="font-body text-sm text-slate-400">Loading source code...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-body text-xs font-bold tracking-[0.25em] uppercase text-blue-700 mb-1">Source Code</p>
            <h1 className="font-heading text-2xl sm:text-3xl text-slate-900">Aether Colt Codebase</h1>
            <p className="font-body text-xs text-slate-400 mt-1">
              {files.length} files &middot; React + FastAPI + Tailwind CSS + Framer Motion
            </p>
          </div>
          <button
            data-testid="download-zip-button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 bg-blue-700 text-white font-body text-xs font-semibold tracking-widest uppercase px-6 py-3 hover:bg-blue-800 transition-colors"
          >
            <Download size={14} />
            Download ZIP
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-[1600px] mx-auto flex" style={{ height: "calc(100vh - 180px)" }}>
        {/* Sidebar */}
        <div className="w-72 xl:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50 flex-shrink-0">
          {/* Search */}
          <div className="p-3 border-b border-slate-200">
            <div className="relative">
              <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                data-testid="code-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter files..."
                className="w-full bg-white border border-slate-200 pl-7 pr-7 py-1.5 font-mono text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
          {/* File Tree */}
          <div className="flex-1 overflow-y-auto py-2">
            <TreeNode name="" node={filteredTree} depth={-1} onSelect={handleSelect} selectedPath={selectedPath} />
          </div>
        </div>

        {/* Code Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* File header */}
          {selectedPath && (
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <FileCode size={14} className={getExtColor(selectedPath)} />
                <span className="font-mono text-xs text-slate-700 font-semibold">{selectedPath}</span>
                <span className="font-mono text-[10px] text-slate-400 ml-2">{lineCount} lines</span>
              </div>
              <button
                data-testid="copy-code-button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 font-body text-xs text-slate-500 hover:text-blue-700 transition-colors px-3 py-1 border border-slate-200 hover:border-blue-300 bg-white"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-green-600">
                      <Check size={12} /> Copied
                    </motion.span>
                  ) : (
                    <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1">
                      <Copy size={12} /> Copy
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          )}
          {/* Code content */}
          <div className="flex-1 overflow-auto bg-slate-950">
            <pre className="p-0 m-0">
              <code className="block font-mono text-xs leading-6">
                {content.split("\n").map((line, i) => (
                  <div key={i} className="flex hover:bg-white/5 transition-colors">
                    <span className="inline-block w-14 text-right pr-4 text-slate-600 select-none flex-shrink-0 bg-slate-900/50">{i + 1}</span>
                    <span className="text-slate-200 pl-4 whitespace-pre">{line}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
