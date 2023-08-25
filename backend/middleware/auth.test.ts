const mockJwtVerify = jest.fn();
jest.mock("../helper/auth", () => ({
  jwtVerify: mockJwtVerify,
}));

const mockNext = jest.fn();

const mockStatus = jest.fn();
const mockSend = jest.fn();

import { authMiddleware } from "./auth";
import { Request, Response } from "express";

describe("authMiddleware", () => {
  describe("auth case", () => {
    const mockJwt = "mock-jwt";

    beforeEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();

      mockJwtVerify.mockImplementation(() => ({
        user: {
          id: 1,
          email: "foo@bar.com",
        },
      }));
    });

    it("handles authed requests", () => {
      const mockValidRequest = {
        cookies: {
          jwt: mockJwt,
        },
      } as Request;

      authMiddleware(mockValidRequest, {} as Response, mockNext);

      expect(mockJwtVerify).toHaveBeenCalledWith(mockJwt);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("unauth case", () => {
    const mockSendReturnValue = "mock-send-return";
    beforeEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();

      mockJwtVerify.mockImplementation(() => {
        throw new Error("some error");
      });
      mockSend.mockReturnValue(mockSendReturnValue);
      mockStatus.mockImplementation(() => ({
        send: mockSend,
      }));
    });

    it("rejects invalid jwt requests", () => {
      const mockInvalidRequest = {
        cookies: {},
      } as Request;

      const mockResponse = {
        status: mockStatus,
      } as unknown as Response;

      authMiddleware(mockInvalidRequest, mockResponse, mockNext);

      expect(mockJwtVerify).toHaveBeenCalledWith(undefined);
      expect(mockNext).not.toHaveBeenCalled();

      const expectedCode = 401;
      expect(mockStatus).toHaveBeenCalledWith(expectedCode);

      const expectedBody = "NOT_AUTHORIZED";
      expect(mockSend).toHaveBeenCalledWith(expectedBody);
    });
  });
});
