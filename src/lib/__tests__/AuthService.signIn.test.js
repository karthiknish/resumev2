const AuthService = require("@/lib/AuthService").default;

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("AuthService.signIn", () => {
  const { signIn: nextAuthSignIn } = require("next-auth/react");
  const { toast } = require("sonner");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns success when NextAuth responds with ok=true", async () => {
    nextAuthSignIn.mockResolvedValueOnce({ ok: true, error: null, status: 200 });

    const result = await AuthService.signIn({ email: "test@example.com", password: "secret" });

    expect(nextAuthSignIn).toHaveBeenCalledWith("credentials", expect.objectContaining({
      redirect: false,
      email: "test@example.com",
      password: "secret",
    }));
    expect(result).toEqual({ success: true, data: { ok: true, error: null, status: 200 } });
    expect(toast.success).toHaveBeenCalled();
  });

  it("returns error when NextAuth responds with ok=false and error", async () => {
    nextAuthSignIn.mockResolvedValueOnce({ ok: false, error: "CredentialsSignin", status: 401 });

    const result = await AuthService.signIn({ email: "bad@example.com", password: "wrong" });

    expect(result.success).toBe(false);
    expect(result.error).toBe("CredentialsSignin");
    expect(toast.error).toHaveBeenCalled();
  });

  it("normalizes provider when called with explicit provider string", async () => {
    nextAuthSignIn.mockResolvedValueOnce({ ok: true, error: null, status: 200 });

    await AuthService.signIn("credentials", { email: "x@y.z", password: "p" });

    expect(nextAuthSignIn).toHaveBeenCalledWith(
      "credentials",
      expect.objectContaining({ redirect: false, email: "x@y.z", password: "p" })
    );
  });
});


