import { render, screen, fireEvent } from "@testing-library/react";
import Auth from "../index";

import { Provider } from "react-redux";
import { reducers } from "../../../state";
import { configureStore } from "@reduxjs/toolkit";

import * as state from "../state";

test("a", () => {
  const spy = jest.spyOn(state, "login");

  const store = configureStore({ reducer: reducers });
  render(
    <Provider store={store}>
      <Auth />
    </Provider>
  );

  const email = screen.getByTestId("email");
  const password = screen.getByTestId("password");

  fireEvent.change(email, { target: { value: "a@b.com" } });
  fireEvent.change(password, { target: { value: "password123" } });

  const submitButton = screen.getByText("SUBMIT");
  fireEvent.click(submitButton);

  const expected = { email: "a@b.com", password: "password123" };
  expect(spy).toBeCalledWith(expected);
});
