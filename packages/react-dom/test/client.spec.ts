import { describe, it, expect } from "vitest";
import { ReactDOM } from "..";

describe("React DOM Client", () => {
  it("should export createRoot", () => {
    expect(ReactDOM.createRoot).toBeDefined();
  });

  it("createRoot 接受一个参数", () => {
    expect(ReactDOM.createRoot.length).toBe(1);
  });

  it("createRoot 返回一个对象", () => {
    const root = ReactDOM.createRoot("");
    expect(typeof root).toBe("object");
  });
});
