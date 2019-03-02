export interface ResolverApi {
  get(url: string): Promise<any>;
  get(options: QueryOptions): Promise<any>;
  post(url: string, body: any): Promise<any>;
  post(options: MutationOptions): Promise<any>;
  del(url: string): Promise<any>;
  del(options: QueryOptions): Promise<any>;
  put(url: string, body: any): Promise<any>;
  put(options: MutationOptions): Promise<any>;
  form(file: any, body: any): Promise<any>;
  query(url: string, q: string): Promise<any>;
  listen(topic: string): void;
}

export interface QueryOptions {
  url: string;
  query?: {
    [name: string]: string | Array<string>;
  };
  headers?: {
    [name: string]: string | Array<string>;
  };
}

export interface MutationOptions extends QueryOptions {
  body: any;
  formData: any;
}

export interface ServiceData {
  url: string;
}
