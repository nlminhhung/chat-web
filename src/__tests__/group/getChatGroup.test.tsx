import { GET } from "@/src/app/api/chat/(Group)/getChatGroup/route"; // Adjust the import path if needed
import { fetchRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { getHash } from "@/src/commands/getHash";

jest.mock("next-auth");
jest.mock("@/src/commands/redis");
jest.mock("@/src/commands/getHash");

const mockedGetServerSession = getServerSession as jest.Mock;
const mockedFetchRedis = fetchRedis as jest.Mock;
const mockedGetHash = getHash as jest.Mock;

describe("GET /api/group", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns group data when authenticated and member", async () => {
    mockedGetServerSession.mockResolvedValueOnce({
      user: { id: "user123", name: "Test User" },
    });

    mockedFetchRedis
      .mockResolvedValueOnce(1) // zscore: isMember
      .mockResolvedValueOnce({
        name: "My Group",
        description: "A test group",
      }); // hgetall: group hash

    mockedGetHash.mockResolvedValueOnce({
      name: "My Group",
      description: "A test group",
    });

    const req = new Request("http://localhost/api/group?groupId=group123");
    const res = await GET(req as any);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({
      name: "My Group",
      description: "A test group",
      id: "group123",
    });

    expect(mockedFetchRedis).toHaveBeenCalledWith(
      "zscore",
      "user:user123:groups",
      "group123"
    );

    expect(mockedFetchRedis).toHaveBeenCalledWith("hgetall", "group:group123");

    expect(mockedGetHash).toHaveBeenCalledWith({
      name: "My Group",
      description: "A test group",
    });
  });

  it("returns 401 when not authenticated", async () => {
    mockedGetServerSession.mockResolvedValueOnce(null);

    const req = new Request("http://localhost/api/group?groupId=group123");
    const res = await GET(req as any);

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data).toEqual({ error: "You are unauthorized!" });
  });

  it("returns 403 when not a member", async () => {
    mockedGetServerSession.mockResolvedValueOnce({
      user: { id: "user123", name: "Test User" },
    });

    mockedFetchRedis.mockResolvedValueOnce(0); // Not a member

    const req = new Request("http://localhost/api/group?groupId=group123");
    const res = await GET(req as any);

    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data).toEqual({ error: "You are not a member of this group!" });
  });

  it("returns 400 on error", async () => {
    mockedGetServerSession.mockResolvedValueOnce({
      user: { id: "user123", name: "Test User" },
    });

    mockedFetchRedis.mockRejectedValueOnce(new Error("Something went wrong"));

    const req = new Request("http://localhost/api/group?groupId=group123");
    const res = await GET(req as any);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data).toEqual({ error: "Something went wrong!" });
  });
});
