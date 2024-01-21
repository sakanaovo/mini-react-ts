// 1. 模拟 React.createElement
// const App = {
//   type: "div",
//   props: {
//     node: "root",
//     children: "Hello World!",
//   },
// };

// 2. 模拟 React.createElement 通过react的jsx语法 安装 react 这个库 通过vite
const App = (
  <div>
    <div>Hello World!</div>
    <div>子节点</div>
  </div>
);

export default App;
