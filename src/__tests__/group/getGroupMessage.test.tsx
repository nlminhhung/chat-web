import { GET } from "@/src/app/api/chat/(Group)/getGroupMessage/route";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { fetchRedis } from "@/src/commands/redis";
import { getHash } from "@/src/commands/getHash";

jest.mock("next-auth");
jest.mock("@/src/commands/redis");
jest.mock("@/src/commands/getHash");

const mockedGetServerSession = getServerSession as jest.Mock;
const mockedFetchRedis = fetchRedis as jest.Mock;
const mockedGetHash = getHash as jest.Mock;

describe("GET /api/groupMessages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns messages for a valid group member", async () => {
    mockedGetServerSession.mockResolvedValueOnce({
      user: { id: "user123", name: "Test User" },
    });

    mockedFetchRedis
      .mockResolvedValueOnce(1) // zscore -> is member
      .mockResolvedValueOnce(["msg1", "msg2"]) // zrange -> messageIds
      .mockResolvedValueOnce({ senderId: "friend1", content: "Hello Alice!" }) // hgetall msg1
      .mockResolvedValueOnce({ senderId: "friend2", content: "Hi Bob!" }); // hgetall msg2

    mockedGetHash.mockImplementation((data) => data);

    mockedFetchRedis
      .mockResolvedValueOnce(JSON.stringify({ name: "Alice", image: "alice.jpg" })) // user:friend1
      .mockResolvedValueOnce(JSON.stringify({ name: "Bob", image: "bob.jpg" })); // user:friend2

    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({ groupId: "group123" }),
      },
    } as unknown as NextRequest;

    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data[0]).toMatchObject({
      senderId: "friend1",
      content: "Hello Alice!",
      name: "Alice",
      senderImage: "alice.jpg",
      messageId: "msg1",
    });
    expect(data[1]).toMatchObject({
      senderId: "friend2",
      content: "Hi Bob!",
      name: "Bob",
      senderImage: "bob.jpg",
      messageId: "msg2",
    });
  });

  it("returns 403 if user is not a group member", async () => {
    mockedGetServerSession.mockResolvedValueOnce({
      user: { id: "user123", name: "Test User" },
    });
    mockedFetchRedis.mockResolvedValueOnce(0); // zscore -> not a member

    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({ groupId: "group123" }),
      },
    } as unknown as NextRequest;

    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data).toMatchObject({ error: "You are not a member of this group!" });
  });

  it("returns 401 if user is not authenticated", async () => {
    mockedGetServerSession.mockResolvedValueOnce(null); // Not logged in

    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({ groupId: "group123" }),
      },
    } as unknown as NextRequest;

    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data).toMatchObject({ error: "You are unauthorized!" });
  });

  it("returns 400 on server error", async () => {
    mockedGetServerSession.mockRejectedValueOnce(new Error("Unexpected error"));

    const req = {
      nextUrl: {
        searchParams: new URLSearchParams({ groupId: "group123" }),
      },
    } as unknown as NextRequest;

    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toMatchObject({ error: "Something went wrong!" });
  });
});
