import { createFiber } from "./ReactFiber";
import { Update } from "./ReactFiberFlags";
import { isArray, isStringOrNumber, updateNode } from "./utils";

export function updateHostComponent(workInProgress) {
  const nextChildren = workInProgress.props.children;
  if (!workInProgress.stateNode) {
    // 创建dom节点
    workInProgress.stateNode = document.createElement(workInProgress.type);
  }
  // 更新dom节点
  updateNode(workInProgress.stateNode, {}, workInProgress.props);

  // 更新子节点
  reconcileChildren(workInProgress, nextChildren);
}

// 协调diff 更新 异步更新
// old abc
// new abcd
function reconcileChildren(workInProgress, children) {
  console.log("reconcileChildren", workInProgress, children);

  // 处理这个children 如果是字符串的话 没有子节点
  if (isStringOrNumber(children)) {
    return;
  }
  const newChildren = isArray(children) ? children : [children];

  let previousNewFiber = null;
  let oldFiber = workInProgress.alternate?.child;
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    if (newChild == null) {
      continue;
    }
    const newFiber = createFiber(newChild, workInProgress);
    const same = sameNode(newFiber, oldFiber);
    if (same) {
      // 复用oldfiber
      Object.assign(newFiber, {
        stateNode: oldFiber.stateNode,
        alternate: oldFiber,
        flags: Update,
      });
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (previousNewFiber == null) {
      workInProgress.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }

    previousNewFiber = newFiber;
  }
}

// 同级比较 同类型 同key
function sameNode(a, b) {
  return a && b && a.type === b.type && a.key === b.key;
}
