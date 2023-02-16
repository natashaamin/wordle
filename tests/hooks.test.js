import { useAppSelector } from "../src/hooks/storeHooks";
import { useSelector } from "react-redux";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe("useAppSelector", () => {
  it("should call useSelector with the correct arguments", () => {
    useAppSelector(() => "test");

    expect(useSelector).toHaveBeenCalledWith(expect.any(Function));
  });
});
