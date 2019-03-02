import * as fetch from 'request';
import { Request } from 'express';
import { resolve } from 'url';
import { MutationOptions, QueryOptions } from '../types';

const concat = require('concat-stream');

function parseUrl(host: string, path: string) {
  return resolve(host, path);
}

export function request(method: string, req: Request | undefined, options: MutationOptions) {
  return new Promise((resolve, reject) => {
    const headers = (req && req.headers) || {};

    fetch(
      {
        url: options.url,
        rejectUnauthorized: false,
        method,
        json: true,
        headers: {
          authorization: headers.authorization,
          'user-agent': headers['user-agent'],
          'proxy-authorization': headers['proxy-authorization'],
          'www-authenticate': headers['www-authenticate'],
          'proxy-authenticate': headers['proxy-authenticate'],
          ...options.headers,
        },
        body: options.body,
        formData: options.formData,
      },
      (error, _, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
  });
}

export function getFormData(upload: any, data: any) {
  const formData = {};

  Object.keys(data || {}).forEach(key => {
    const value = data[key];

    if (value !== undefined) {
      formData[key] = value;
    }
  });

  return new Promise(resolve => {
    if (upload) {
      upload.then((file: any) => {
        file.stream.pipe(
          concat((value: any) =>
            resolve({
              file: {
                value,
                options: {
                  filename: file.filename,
                },
              },
              ...formData,
            }),
          ),
        );
      });
    } else {
      resolve(formData);
    }
  });
}

export function createOptions(
  host: string,
  pathOrOptions: string | QueryOptions & Partial<MutationOptions>,
  body?: any,
): MutationOptions {
  if (typeof pathOrOptions === 'string') {
    return {
      url: parseUrl(host, pathOrOptions),
      formData: undefined,
      body,
      headers: {},
      query: {},
    };
  }

  return {
    ...pathOrOptions,
    body: pathOrOptions.body,
    formData: pathOrOptions.formData,
    headers: pathOrOptions.headers || {},
    query: pathOrOptions.query || {},
    url: parseUrl(host, pathOrOptions.url),
  };
}
