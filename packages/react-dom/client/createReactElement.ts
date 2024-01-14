export function createReactElement(child: any, parentElement: HTMLElement) {
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
