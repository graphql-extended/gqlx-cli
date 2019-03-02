import { Request } from 'express';
import { Service } from 'gqlx-apollo-express-server';
import { subscribeTo } from './listener';
import { createOptions, request, getFormData } from './io';
import { ResolverApi, QueryOptions, MutationOptions, ServiceData } from '../types';

export const apiDefinition = {
  get: true,
  post: true,
  del: true,
  put: true,
  query: true,
  form: true,
  listen: false,
};

export function createApi(service: Service<ResolverApi, ServiceData>, req: Request | undefined): ResolverApi {
  return {
    del(url: string | QueryOptions) {
      const options = createOptions(service.data.url, url);
      return request('DELETE', req, options);
    },
    form(file: any, data: any) {
      return getFormData(file, data);
    },
    get(url: string | QueryOptions) {
      const options = createOptions(service.data.url, url);
      return request('GET', req, options);
    },
    query(url: string, q: string) {
      const options = createOptions(service.data.url, url, { query: q });
      return request('POST', req, options);
    },
    listen(topic: string) {
      return subscribeTo(topic);
    },
    post(url: string | MutationOptions, body?: any) {
      const options = createOptions(service.data.url, url, body);
      return request('POST', req, options);
    },
    put(url: string | MutationOptions, body?: any) {
      const options = createOptions(service.data.url, url, body);
      return request('PUT', req, options);
    },
  };
}
