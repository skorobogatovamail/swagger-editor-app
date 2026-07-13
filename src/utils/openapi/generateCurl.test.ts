import { describe, expect, it } from 'vitest';
import { generateCurl } from './generateCurl';

describe('generateCurl', () => {
  it('generates cURL for GET request with headers', () => {
    expect(
      generateCurl({
        method: 'get',
        url: 'https://api.example.com/users?limit=10',
        headers: {
          Authorization: 'Bearer token',
        },
      })
    ).toBe(
      "curl -X GET 'https://api.example.com/users?limit=10' -H 'Authorization: Bearer token'"
    );
  });

  it('generates cURL for POST request with JSON body', () => {
    expect(
      generateCurl({
        method: 'post',
        url: 'https://api.example.com/users',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{"name":"Elena"}',
      })
    ).toBe(
      'curl -X POST \'https://api.example.com/users\' -H \'Content-Type: application/json\' --data \'{"name":"Elena"}\''
    );
  });

  it('escapes single quotes safely', () => {
    expect(
      generateCurl({
        method: 'post',
        url: 'https://api.example.com/users',
        headers: {},
        body: "{'name':'Elena'}",
      })
    ).toContain("--data '{'\\''name'\\'':'\\''Elena'\\''}'");
  });
});
