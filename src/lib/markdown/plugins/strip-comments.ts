import { visit } from "unist-util-visit";
import type { Root } from "mdast";

export function remarkStripComments() {
  return (tree: Root) => {
    visit(tree, "html", (node, index, parent) => {
      if (
        typeof node.value === "string" &&
        node.value.match(/^\s*<!--[\s\S]*?-->\s*$/)
      ) {
        if (parent && typeof index === "number") {
          parent.children.splice(index, 1);
          return index;
        }
      }
    });
  };
}
