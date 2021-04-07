import { Readable } from 'stream';

type AnyObject = {
  [key: string]: any
}

interface Request extends Readable {
  headers: AnyObject
  query: AnyObject
  raw: AnyObject
  path: string
  httpMethod: string
  body: any
}

interface NetlifyEvent {
  multiValueHeaders: AnyObject
  headers: AnyObject
  isBase64Encoded: boolean
  multiValueQueryStringParameters: AnyObject
  queryStringParameters: AnyObject
  httpMethod: string
  path: string
  body: AnyObject
}

export default class Netlify {
  values: any[];

  constructor(...values: any[]) {
    this.values = values;
  }

  getRequest(): Request {
    const event = this.values[0] as NetlifyEvent;
    const body = new Readable();
    body._read = () => {};
    body.push(event.body);
    body.push(null);
    const req = body as Request;
    req.headers = event.headers;
    req.query = event.queryStringParameters;
    req.httpMethod = event.httpMethod;
    req.path = event.path;
    req.body = event.body;
    req.raw = event;

    return req;
  }

  willReturnResponse(result: any) {
    // Netlify doesn't need this
    return result;
  }

}
