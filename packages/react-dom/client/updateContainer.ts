import { Fiber, FiberRoot } from "./type";
import { Placement } from "./ReactFiberFlags";
import { HostComponent } from "./ReactWorkTags";
import { updateNode } from "./utils";
function getCurrentTime() {
  return performance.now();
}

function requestUpdateLane(fiber: any) {
  const eventLane = 16; // getCurrentEventPriority();
  return eventLane;
}

function createUpdate(eventTime: number, lane: any) {
  // update 是一个 链表结构
  const update = {
    eventTime,
    lane,
    tag: 0, // 暂时为0 0 表示UpdateState
    payload: null,
    callback: null,
    next: null,
  };

  return update;
}

// 协调diff 更新 异步更新
// old abc
// new abcd
function reconcileChildren(workInProgress, children) {
  console.log("diff", workInProgress, children);
  // 处理这个children

  const newChildren = Array.isArray(children) ? children : [children];
  console.log("newChildren", newChildren);

  let previousNewFiber = null; // 上一个新的fiber
  for (const child of newChildren) {
    const newFiber = createFiber(child, workInProgress);
    if (newFiber == null) {
      continue;
    }
    workInProgress.child = newFiber;
    // 获取 workInProgress.child
    if (previousNewFiber == null) {
      workInProgress.child = newFiber;
    }
    // 如果有上一个新的fiber 就让上一个新的fiber的sibling指向当前的fiber
    else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
  }
}

function updateHostComponent(workInProgress) {
  // 如果
  console.log("updateHostComponent workInProgress", workInProgress);
  const nextChildren = workInProgress.props.props.children || {
    type: "div",
    props: {
      children: ["hello world"],
    },
  };
  console.log("nextChildren", nextChildren);

  if (!workInProgress.stateNode) {
    // 创建dom节点
    workInProgress.stateNode = document.createElement(workInProgress.type);
  }

  updateNode(workInProgress.stateNode, workInProgress.props);
  // 更新子节点
  console.log("workInProgress.props.children", workInProgress);

  reconcileChildren(workInProgress, nextChildren);
}
let workInProgress = null; // 用于记录当前正在工作的fiber
// 用于记录当前正在工作的fiber
function scheduleUpdateOnFiber(fiber: any) {
  workInProgress = fiber;
}

function performUnitOfWork(workInProgress: any) {
  // TODO 这里放开会报错 后续优化
  if (!workInProgress) return;
  // 1. 处理workInProgress
  const { tag } = workInProgress;
  switch (tag) {
    case HostComponent:
      updateHostComponent(workInProgress);
      break;
    default:
      break;
  }

  // 2. 更新workInProgress 国王的故事 深度优先遍历
  if (workInProgress.child) {
    workInProgress = workInProgress.child;
    return;
  }
  // 3. 没有子节点的情况下
  let next = workInProgress;
  console.log("next", next);

  // 4. 如果没有子节点，就找兄弟节点
  while (next) {
    if (next.sibling) {
      workInProgress = next.sibling;
      return;
    }
    next = next.return;
  }

  return null;
}

function workLoop(IdleDeadline) {
  console.log("workInProgress", workInProgress);
  while (workInProgress !== null && IdleDeadline.timeRemaining() > 0) {
    // 更新fiber
    workInProgress = performUnitOfWork(workInProgress);
  }
}

requestIdleCallback(workLoop);

function createFiber(vnode: any, returnFiber: any) {
  console.log("vnode", vnode);

  const fiber = {
    tag: null, // 用于标记当前节点的类型
    type: vnode.type, // 用于记录当前节点的类型
    key: vnode.key, // 用于记录当前节点的key
    props: vnode, // 用于记录当前节点的属性
    stateNode: null, // dom节点
    child: null, // 第一个子节点
    sibling: null, // 兄弟节点
    return: returnFiber, // 父亲节点
    alternate: null, // 用于记录当前节点上一次的fiber oldFiber
    flags: Placement, // 用于标记当前节点的更新情况
    subtreeFlags: 0, // 用于标记子树的更新情况
    deletions: null, // 用于标记需要删除的节点
    nextEffect: null, // 用于标记需要执行的effect
    lanes: 0, // 用于标记优先级
    childLanes: 0, // 用于标记子树的优先级
    index: 0, // 在父亲节点中的位置
    memoizedState: null, // 用于记录组件的状态
    memoizedProps: null, // 用于记录组件的props
    updateQueue: null, // 用于记录组件的更新队列
  };

  const { type } = vnode;
  if (typeof type === "string") {
    fiber.tag = HostComponent;
  }

  return fiber;
}

export function updateContainer(element: any, container: FiberRoot) {
  const { containerInfo } = container; // 父亲节点
  console.log("containerInfo", element, containerInfo);
  const fiber = createFiber(element, {
    type: containerInfo.nodeName.toLowerCase(),
    stateNode: containerInfo,
  });

  console.log("fiber", fiber);

  scheduleUpdateOnFiber(fiber);
}
