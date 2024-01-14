import { type FiberRoot } from "./type";

function ReactDOMRoot(internalRoot: FiberRoot) {
  this._internalRoot = internalRoot;
}
function createReactElement(child: any, parentElement: HTMLElement) {
  if (typeof child === "string") {
    const textNode = document.createTextNode(child);
    parentElement.appendChild(textNode);
  } else {
    const childElement = document.createElement(child.type);
    parentElement.appendChild(childElement);
    if (child.props && child.props.children) {
      typeof child.props.children === "string"
        ? createReactElement(child.props.children, childElement)
        : child.props.children.forEach((item: any) => {
            createReactElement(item, childElement);
          });
    }
  }
}

ReactDOMRoot.prototype.render = function (children: any) {
  // 创建root 存下来 用于后续更新
  const root = this._internalRoot;
  console.log("children", children.props.children);
  // 通过dom的方式渲染 children 是一个对象 { type: "div", props: { children: ["hello world", type: "div", props: { children: ["hello world"]] } 递归渲染 在root上
  createReactElement(children, root);
};

function createRoot(container: any) {
  const root = new ReactDOMRoot(container);
  console.log("root", root);

  return root;
}

export default { createRoot };
