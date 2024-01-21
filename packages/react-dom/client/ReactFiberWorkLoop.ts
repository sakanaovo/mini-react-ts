import { Placement, Update } from "./ReactFiberFlags";
import { updateHostComponent } from "./ReactFiberReconciler";
import { HostComponent } from "./ReactWorkTags";
import { updateNode } from "./utils";

let workInProgress = null; // 用于记录当前正在工作的fiber
let workInProgressRoot = null; // 用于记录当前正在工作的fiber

export function scheduleUpdateOnFiber(fiber) {
  workInProgress = fiber;
  workInProgressRoot = fiber;
}

// 1. 处理workInProgress
// 2. 更新workInProgress
function performUnitWork() {
  // todo 1. 处理workInProgress
  const { tag } = workInProgress;

  switch (tag) {
    case HostComponent:
      updateHostComponent(workInProgress);
      break;
    default:
      break;
  }

  // 2. 更新workInProgress 国王的故事 深度优先
  if (workInProgress.child) {
    workInProgress = workInProgress.child;
    return;
  }

  let next = workInProgress;

  while (next) {
    if (next.sibling) {
      workInProgress = next.sibling;
      return;
    }
    next = next.return;
  }
  workInProgress = null;
}

function workLoop(IdleDeadline) {
  while (IdleDeadline.timeRemaining() > 0 && workInProgress) {
    performUnitWork();
  }

  // commit
  if (!workInProgress && workInProgressRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function commitRoot() {
  commitWorker(workInProgressRoot);
  workInProgressRoot = null;
}

function commitWorker(workInProgress) {
  if (!workInProgress) {
    return;
  }
  // 1. 提交自己
  // ! 这里没加判断 stateNode 是dom节点
  const { flags, stateNode } = workInProgress;
  console.log("stateNode", stateNode);

  // 父dom节点
  // todo 不是所有fiber都有dom节点
  const parentNode = getParentNode(workInProgress.return); //workInProgress.return.stateNode;
  // 插入（初次渲染、更新移动位置）
  if (flags & Placement && stateNode) {
    parentNode.appendChild(stateNode);
  }

  if (flags & Update && stateNode) {
    updateNode(
      workInProgress.stateNode,
      workInProgress.alternate.props,
      workInProgress.props
    );
  }

  // 2. 提交子节点
  commitWorker(workInProgress.child);
  // 3. 提交兄弟
  commitWorker(workInProgress.sibling);
}

// 有没有可能找不到
// 可能找不到0
// 一定能找到扣1
function getParentNode(workInProgress) {
  let tem = workInProgress;

  while (tem) {
    if (tem.stateNode) {
      return tem.stateNode;
    }
    tem = tem.return;
  }
}
