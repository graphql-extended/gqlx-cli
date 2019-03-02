import { $$asyncIterator } from 'iterall';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export function subscribeTo(topic: string) {
  const asyncIterator = pubsub.asyncIterator(topic);

  const getNextPromise = (): any => {
    return asyncIterator.next().then(async payload => {
      const data: any = payload.value;

      if (payload.done) {
        return payload;
      } else if (data) {
        return payload;
      }

      return getNextPromise();
    });
  };

  return {
    next() {
      return getNextPromise();
    },
    return() {
      return (asyncIterator.return as any)();
    },
    throw(error: Error) {
      return (asyncIterator.throw as any)(error);
    },
    [$$asyncIterator]() {
      return this;
    },
  };
}
