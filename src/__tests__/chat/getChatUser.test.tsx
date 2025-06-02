import { GET } from '@/src/app/api/chat/(Direct)/getChatUser/route';
import { fetchRedis } from '@/src/commands/redis';
import { getServerSession } from 'next-auth';

jest.mock('@/src/commands/redis');
jest.mock('next-auth');

const mockedFetchRedis = fetchRedis as jest.Mock;
const mockedGetServerSession = getServerSession as jest.Mock;

describe('GET /api/chat/(Direct)/getChatUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns friend info when session exists and they are friends', async () => {
    mockedGetServerSession.mockResolvedValueOnce({
      user: { id: 'user123' },
    });

    mockedFetchRedis
      .mockResolvedValueOnce(1) // zscore -> isFriend = 1
      .mockResolvedValueOnce(
        JSON.stringify({
          id: 'friend456',
          name: 'Friend Name',
          image: 'https://image.url/friend.jpg',
        })
      );

    const req = new Request('http://localhost/api/chat/(Direct)/getChatUser?friendId=friend456');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({
      name: 'Friend Name',
      image: 'https://image.url/friend.jpg',
      id: 'friend456',
    });
  });

  it('returns 401 if no session', async () => {
    mockedGetServerSession.mockResolvedValueOnce(null);

    const req = new Request('http://localhost/api/chat/(Direct)/getChatUser?friendId=friend456');
    const res = await GET(req);

    expect(res.status).toBe(401);
    const data = await res.text();
    expect(data).toEqual('You are unauthorized!');
  });

  it('returns 400 if users are not friends', async () => {
    mockedGetServerSession.mockResolvedValueOnce({
      user: { id: 'user123' },
    });

    mockedFetchRedis.mockResolvedValueOnce(null); // zscore returns null -> not friends

    const req = new Request('http://localhost/api/chat/(Direct)/getChatUser?friendId=friend456');
    const res = await GET(req);

    expect(res.status).toBe(400);
    const data = await res.text();
    expect(data).toBe('These users are not friends!');
  });

  it('returns 400 if something else goes wrong', async () => {
    mockedGetServerSession.mockRejectedValueOnce(new Error('fail'));

    const req = new Request('http://localhost/api/chat/(Direct)/getChatUser?friendId=friend456');
    const res = await GET(req);

    expect(res.status).toBe(400);
    const data = await res.text();
    expect(data).toBe('Something went wrong!' );
  });
});
