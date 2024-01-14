import { createReactElement } from "./createReactElement";
import { type FiberRoot } from "./type";
import { updateContainer } from "./updateContainer";

function ReactDOMRoot(internalRoot: FiberRoot) {
  this._internalRoot = internalRoot;
}

ReactDOMRoot.prototype.render = function (children: any) {
  // 创建root 存下来 用于后续更新
  const root = this._internalRoot;
  console.log("root", root);

  // 通过dom的方式渲染 children 是一个对象 { type: "div", props: { children: ["hello world", type: "div", props: { children: ["hello world"]] } 递归渲染 在root上
  createReactElement(children, root.containerInfo);

  updateContainer(children, root);
};

function createRoot(container: any) {
  const root = { containerInfo: container } as FiberRoot;

  return new ReactDOMRoot(root);
}

export default { createRoot };
