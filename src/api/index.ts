import { Request as ExpressRequest } from 'express';
import { Service } from 'gqlx-apollo-express-server';
import { subscribeTo } from './listener';
import { RequestAPI, Request, Options, RequiredUriUrl } from 'request';
import { createOptions, request, getFormData } from './io';
import { ResolverApi, QueryOptions, MutationOptions, ServiceData } from '../types';

export const apiDefinition = {
  get: true,
  post: true,
  del: true,
  put: true,
  patch: true,
  query: true,
  form: true,
  listen: false,
};

export function createApi(
  fetch: RequestAPI<Request, Options, RequiredUriUrl>,
  service: Service<ResolverApi, ServiceData>,
  req: ExpressRequest | undefined,
): ResolverApi {
  return {
    del(url: string | QueryOptions) {
      const options = createOptions(service.data.url, url);
      return request(fetch, 'DELETE', req, options);
    },
    form(file: any, data: any) {
      return getFormData(file, data);
    },
    get(url: string | QueryOptions) {
      const options = createOptions(service.data.url, url);
      return request(fetch, 'GET', req, options);
    },
    query(url: string, q: string) {
      const options = createOptions(service.data.url, url, { query: q });
      return request(fetch, 'POST', req, options);
    },
    listen(topic: string) {
      return subscribeTo(topic);
    },
    post(url: string | MutationOptions, body?: any) {
      const options = createOptions(service.data.url, url, body);
      return request(fetch, 'POST', req, options);
    },
    put(url: string | MutationOptions, body?: any) {
      const options = createOptions(service.data.url, url, body);
      return request(fetch, 'PUT', req, options);
    },
    patch(url: string | MutationOptions, body?: any) {
      const options = createOptions(service.data.url, url, body);
      return request(fetch, 'PATCH', req, options);
    },
  };
}
