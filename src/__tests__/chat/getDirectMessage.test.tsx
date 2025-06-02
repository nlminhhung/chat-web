import { GET } from '@/src/app/api/chat/(Direct)/getDirectMessage/route';
import { getServerSession } from 'next-auth';
import { fetchRedis } from '@/src/commands/redis';
import { getHash } from '@/src/commands/getHash';
jest.mock('next-auth');
jest.mock('@/src/commands/redis');
jest.mock('@/src/commands/getHash');

const mockedGetServerSession = getServerSession as jest.Mock;
const mockedFetchRedis = fetchRedis as jest.Mock;
const mockedGetHash = getHash as jest.Mock;

describe('GET api/chat/(Direct)/getDirectMessage?friendId=friend123', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 when no session', async () => {
    mockedGetServerSession.mockResolvedValueOnce(null);

    const req = new Request('http://localhost/api/chat/(Direct)/getDirectMessage?friendId=friend123');

    const res = await GET(req as any);
    expect(res.status).toBe(401);
    const text = await res.text();
    expect(text).toBe('You are unauthorized!');
  });

  it('returns 403 when users are not friends', async () => {
    mockedGetServerSession.mockResolvedValueOnce({
      user: { id: 'user123', name: 'Test User' },
    });

    mockedFetchRedis.mockResolvedValueOnce(0); // zscore -> not friends

    const req = new Request('http://localhost/api/chat/(Direct)/getDirectMessage?friendId=friend123');

    const res = await GET(req as any);
    expect(res.status).toBe(403);
    const text = await res.text();
    expect(text).toBe('These users are not friends!');
  });

  it('handles errors', async () => {
    mockedGetServerSession.mockRejectedValueOnce(new Error('Test error'));

    const req = new Request('http://localhost/api/chat/(Direct)/getDirectMessage?friendId=friend123');

    const res = await GET(req as any);

    expect(res.status).toBe(400);
    const text = await res.text();
    expect(text).toBe('Something went wrong!');
  });
});