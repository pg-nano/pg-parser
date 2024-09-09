import { NodeTag, NodePath } from "./node.js"

export type Walker<TNodePath extends NodePath = NodePath> = (
  node: TNodePath,
) => boolean | void

export type Visitor = {
  [TNodeTag in NodeTag]?: Walker<NodePath<TNodeTag>>
}

/**
 * Walks the tree of nodes, calling the callback for each node. You may pass a
 * simple callback (which receives every encountered node) or a visitor object
 * (which may specify callbacks for particular node types).
 *
 * If a callback returns `false`, the walk will continue to the next sibling
 * node, rather than recurse into the children of the current node.
 */
export function walk(
  root: any,
  callback: Walker | Visitor,
  parent: NodePath | null = null,
) {
  if (typeof callback !== "function") {
    const visitor = callback
    callback = (path) => visitor[path.tag]?.(path as any)
  }
  if (Array.isArray(root)) {
    root.forEach((node) => walk(node, callback))
  } else if (typeof root === "object" && root !== null) {
    const keys = Object.keys(root)
    if (keys.length === 1 && /^[A-Z]/.test(keys[0])) {
      const tag = keys[0] as NodeTag
      const path = new NodePath(tag, root[tag], parent)
      const result = callback(path)
      if (result === false) {
        return
      }
      parent = path
    }
    for (const key in root) {
      const value = root[key]
      walk(value, callback)
    }
  }
}
