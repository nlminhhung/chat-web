import { POST } from '@/src/app/api/friends/accept/route';
import { getServerSession } from 'next-auth';
import { fetchRedis } from '@/src/commands/redis';

jest.mock('next-auth');
jest.mock('@/src/commands/redis');

const mockedGetServerSession = getServerSession as jest.Mock;
const mockedFetchRedis = fetchRedis as jest.Mock;

describe('POST /api/friends/accept', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 when no session', async () => {
    mockedGetServerSession.mockResolvedValueOnce(null);

    const req = new Request('http://localhost/api/friends/accept', {
      method: 'POST',
      body: JSON.stringify({ id: 'friend123' }),
    });

    const res = await POST(req);

    expect(res.status).toBe(401);
    const text = await res.text();
    expect(text).toBe('You are unauthorized!');
  });

  it('returns 400 when already friends', async () => {
    mockedGetServerSession.mockResolvedValueOnce({
      user: { id: 'user123', name: 'Test User' },
    });

    mockedFetchRedis.mockResolvedValueOnce(1); // zscore returns 1 (already friends)

    const req = new Request('http://localhost/api/friends/accept', {
      method: 'POST',
      body: JSON.stringify({ id: 'friend123' }),
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    const text = await res.text();
    expect(text).toBe('Already friends');
  });

  it('returns 400 when request does not exist', async () => {
    mockedGetServerSession.mockResolvedValueOnce({
      user: { id: 'user123', name: 'Test User' },
    });

    mockedFetchRedis
      .mockResolvedValueOnce(0) // zscore -> not friends
      .mockResolvedValueOnce(0); // hexists -> request does not exist

    const req = new Request('http://localhost/api/friends/accept', {
      method: 'POST',
      body: JSON.stringify({ id: 'friend123' }),
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    const text = await res.text();
    expect(text).toBe("Request doesn't exist!");
  });

  it('accepts the friend request successfully', async () => {
    mockedGetServerSession.mockResolvedValueOnce({
      user: { id: 'user123', name: 'Test User' },
    });

    mockedFetchRedis
      .mockResolvedValueOnce(0) // zscore -> not friends
      .mockResolvedValueOnce(1); // hexists -> request exists

    // For all Promise.all Redis commands, just resolve to anything
    mockedFetchRedis.mockResolvedValue('OK');

    const req = new Request('http://localhost/api/friends/accept', {
      method: 'POST',
      body: JSON.stringify({ id: 'friend123' }),
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toBe('OK');
  });
});
