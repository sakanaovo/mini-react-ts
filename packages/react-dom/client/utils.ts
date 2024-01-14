export function updateNode(stateNode, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      stateNode[key] = props[key];
    }
  });
}
