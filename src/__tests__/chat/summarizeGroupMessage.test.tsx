import { GET } from '@/src/app/api/chat/(Group)/summarizeGroupMessages/route';
import { fetchRedis } from '@/src/commands/redis';
import { getServerSession } from 'next-auth';
import OpenAI from 'openai';

jest.mock('@/src/commands/redis');
jest.mock('next-auth');
jest.mock('openai');

// Cast OpenAI class constructor to jest.Mock to fix TS error
const MockOpenAI = OpenAI as unknown as jest.Mock<InstanceType<typeof OpenAI>, any[]>;

describe('GET handler', () => {
  let mockCreate: jest.Mock;

  beforeEach(() => {
  jest.clearAllMocks();

  mockCreate = jest.fn();

  MockOpenAI.mockImplementation((): any => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  }));
});


  it('returns 401 if no session', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const url = new URL('http://localhost/api?groupId=group1');
    const req = { nextUrl: url } as any;

    const res = await GET(req);

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('You are unauthorized!');
  });

  it('returns 500 on general error', async () => {
    (getServerSession as jest.Mock).mockRejectedValue(new Error('fail'));

    const url = new URL('http://localhost/api?groupId=group1');
    const req = { nextUrl: url } as any;

    const res = await GET(req);

    expect(res.status).toBe(500);
    const data = await res.text();
    expect(data).toBe('Internal server error');
  });
});
