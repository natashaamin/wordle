import React from "react";
import {App} from "../App";
import renderer from "react-test-renderer";

describe("App", () => {
  it("renders MainScreen component", () => {
    const tree = renderer.create(App).toJSON();
    expect(tree).toMatchSnapshot();
  });
});