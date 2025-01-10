import fetch from 'node-fetch';
import { Log } from './log';

type JSONFetchErr = {
  code?: string;
  status?: string;
  message: string;
  plainError?: string;
  clientError?: boolean;
};
type JSONFetchOptions = {
  okOnly?: boolean;
  showOriginal?: boolean;
  plainError?: boolean;
};
export async function jsonFetch<R = any>(
  endpoint: string,
  method: string,
  body: object | string,
  headers = {},
  options: JSONFetchOptions = {}
): Promise<[R?, JSONFetchErr?]> {
  const sendData = typeof body === 'string' ? body : JSON.stringify(body);

  const fetchOptions = {
    method,
    body: sendData ? sendData : null,
    headers: { 'content-type': 'application/json', ...headers },
  };
  let res = null;
  try {
    res = await fetch(endpoint, fetchOptions);
    Log({
      message: res,
      exceptProduction: true,
    });
  } catch (e) {
    const message =
      e.code === 'ENOTFOUND' ? `${endpoint} could not be found` : e.message;
    return [null, { code: 'FAILED_TO_FETCH', message }];
  }

  if (options.okOnly) {
    if (res.status != 200)
      return [
        null,
        { code: 'NOT_OK', status: res.status, message: 'Response Not OK' },
      ];
  }

  if (options.showOriginal) {
    if (res.status !== 200) {
      const text = await res.text();
      return [null, text];
    }
  }

  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch (e) {
    if (options.plainError) return [null, { clientError: true, message: text }];
    return [
      null,
      { code: 'JSON_PARSE_FAILED', message: `Failed to parse ${text}` },
    ];
  }

  return [json, null];
}
