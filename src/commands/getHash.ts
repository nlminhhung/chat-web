// this is redis hgetall command

export async function getHash(array: string[]) {
    const result: Record<string, any> = {};
    for (let i = 0; i < array.length; i += 2) {
      const key = array[i];
      const value = array[i + 1];
      result[key] = value;
    }
    return result;
}
