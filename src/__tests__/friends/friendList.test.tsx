import { GET } from "@/src/app/api/friends/friendList/route"; // Adjust the path
import { getServerSession } from "next-auth";
import { fetchRedis } from "@/src/commands/redis";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/src/commands/redis", () => ({
  fetchRedis: jest.fn(),
}));

const mockedGetServerSession = getServerSession as jest.Mock;
const mockedFetchRedis = fetchRedis as jest.Mock;

describe("GET /api/friends", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    mockedGetServerSession.mockResolvedValueOnce(null);

    const req = new Request("http://localhost/api/friends");

    const res = await GET(req as any);
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body).toEqual({ message: "You are unauthorized!" });
  });

  it("returns 400 when an error occurs", async () => {
    mockedGetServerSession.mockRejectedValueOnce(new Error("Mocked error"));

    const req = new Request("http://localhost/api/friends");

    const res = await GET(req as any);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body).toEqual({ message: "Something went wrong!" });
  });
});
