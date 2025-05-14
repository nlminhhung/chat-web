import { GET } from '@/src/app/api/friends/suggest/route';
import { fetchRedis } from '@/src/commands/redis';
import { getServerSession } from 'next-auth';

jest.mock('@/src/commands/redis');
jest.mock('next-auth');

const mockedFetchRedis = fetchRedis as jest.Mock;
const mockedGetServerSession = getServerSession as jest.Mock;

describe('GET /api/friends/suggest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns user info for online users when session exists', async () => {
    const userId = 'user123';
    const mockKey = [userId];
    const mockUser = {
      id: userId,
      name: 'John Doe',
      image: 'https://example.com/image.jpg',
      email: 'test@gmail.com',
      role: 'admin',
    };

    // Mock session
    mockedGetServerSession.mockResolvedValueOnce({
      user: {
        id: 'mock-user',
        name: 'Mock User',
      },
    });

    // Mock Redis responses
    mockedFetchRedis
      .mockResolvedValueOnce(mockKey) // hkeys onlineUsers
      .mockResolvedValueOnce(JSON.stringify(mockUser)); // get user:{userId}

    const req = new Request('api/friends/suggest');
    const res = await GET(req);

    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toEqual([
      {
        id: userId,
        name: mockUser.name,
        image: mockUser.image,
        email: mockUser.email,
      },
    ]);
  });

  it('returns 401 when no session', async () => {
    mockedGetServerSession.mockResolvedValueOnce(null);

    const req = new Request('http://localhost/api/friends/suggest');
    const res = await GET(req);

    expect(res.status).toBe(401);
    const text = await res.text();
    expect(text).toBe('You are unauthorized!');
  });
});
