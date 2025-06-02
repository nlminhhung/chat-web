import { POST } from '@/src/app/api/friends/add/route';
import { getServerSession } from 'next-auth';
import { fetchRedis, postRedis } from '@/src/commands/redis';

jest.mock('next-auth');
jest.mock('@/src/commands/redis');

const mockedGetServerSession = getServerSession as jest.Mock;
const mockedFetchRedis = fetchRedis as jest.Mock;
const mockedPostRedis = postRedis as jest.Mock;

describe('POST /api/friends/add', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 when no session', async () => {
    mockedGetServerSession.mockResolvedValueOnce(null);

    const req = new Request('http://localhost/api/friends/add', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', message: 'Hi!' }),
    });

    const res = await POST(req);

    expect(res.status).toBe(401);
    const text = await res.text();
    expect(text).toContain('You are unauthorized!');
  });

  it('returns 404 when user not found', async () => {
    mockedGetServerSession.mockResolvedValueOnce({
      user: { id: 'user123', name: 'Test User' },
    });

    mockedFetchRedis.mockResolvedValueOnce(null); // user:email not found

    const req = new Request('http://localhost/api/friends/add', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', message: 'Hi!' }),
    });

    const res = await POST(req);

    expect(res.status).toBe(404);
    const text = await res.text();
    expect(text).toContain('This person does not exist!');
  });

  it('returns 400 when adding yourself', async () => {
    mockedGetServerSession.mockResolvedValueOnce({
      user: { id: 'user123', name: 'Test User' },
    });

    mockedFetchRedis.mockResolvedValueOnce('user123'); // user:email points to self

    const req = new Request('http://localhost/api/friends/add', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', message: 'Hi!' }),
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    const text = await res.text();
    expect(text).toContain('You can not add yourself as a friend!');
  });

  it('returns 400 when request already sent', async () => {
    mockedGetServerSession.mockResolvedValueOnce({
      user: { id: 'user123', name: 'Test User' },
    });

    mockedFetchRedis
      .mockResolvedValueOnce('friend123') // user:email -> id
      .mockResolvedValueOnce(1); // hexists -> request already sent

    const req = new Request('http://localhost/api/friends/add', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', message: 'Hi!' }),
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    const text = await res.text();
    expect(text).toContain('Already sent request to this user!');
  });

  it('returns 400 when already friends', async () => {
    mockedGetServerSession.mockResolvedValueOnce({
      user: { id: 'user123', name: 'Test User' },
    });

    mockedFetchRedis
      .mockResolvedValueOnce('friend123') // user:email -> id
      .mockResolvedValueOnce(0) // hexists -> no existing request
      .mockResolvedValueOnce(1); // zscore -> already friends

    const req = new Request('http://localhost/api/friends/add', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', message: 'Hi!' }),
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    const text = await res.text();
    expect(text).toContain('Already friends with this user!');
  });

  it('sends friend request successfully', async () => {
    mockedGetServerSession.mockResolvedValueOnce({
      user: { id: 'user123', name: 'Test User' },
    });

    mockedFetchRedis
      .mockResolvedValueOnce('friend123') // user:email -> id
      .mockResolvedValueOnce(0) // hexists -> no existing request
      .mockResolvedValueOnce(0); // zscore -> not friends

    mockedPostRedis.mockResolvedValueOnce('OK');

    const req = new Request('http://localhost/api/friends/add', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', message: 'Hi!' }),
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('Request has been sent!');
  });
});
