import { FiberRoot } from "./type";
import { createFiber } from "./ReactFiber";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";

export function updateContainer(element: any, container: FiberRoot) {
  const { containerInfo } = container; // 父亲节点
  const fiber = createFiber(element, {
    type: containerInfo.nodeName.toLowerCase(),
    stateNode: containerInfo,
  });

  scheduleUpdateOnFiber(fiber);
}
