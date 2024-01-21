import { Placement } from "./ReactFiberFlags";
import { HostComponent } from "./ReactWorkTags";

export function createFiber(vnode: any, returnFiber: any) {
  const fiber = {
    tag: null, // 用于标记当前节点的类型
    type: vnode.type, // 用于记录当前节点的类型
    key: vnode.key, // 用于记录当前节点的key
    props: vnode.props, // 用于记录当前节点的属性
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

  const type = vnode.type;
  if (typeof type === "string") {
    fiber.tag = HostComponent;
  }

  return fiber;
}
