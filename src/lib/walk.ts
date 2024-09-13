import { NodePath, type NodeTag } from './node.js'

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
  keyPath: readonly (string | number)[] = [],
) {
  if (typeof callback !== 'function') {
    const visitor = callback
    callback = path => visitor[path.tag]?.(path as any)
  }
  if (Array.isArray(root)) {
    root.forEach((node, index) => {
      walk(node, callback, parent, [...keyPath, index])
    })
  } else if (typeof root === 'object' && root !== null) {
    const keys = Object.keys(root)
    if (keys.length === 1 && /^[A-Z]/.test(keys[0])) {
      const tag = keys[0] as NodeTag
      const node = root[tag]
      const path = new NodePath(tag, node, parent, keyPath)
      if (callback(path) === false) {
        return
      }
      for (const key in node) {
        walk(node[key], callback, path, [...keyPath, key])
      }
    } else {
      for (const key of keys) {
        walk(root[key], callback, parent, [...keyPath, key])
      }
    }
  }
}
