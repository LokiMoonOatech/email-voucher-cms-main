import middy from '@middy/core';
import cors from '@middy/http-cors';

export const middyfy = (handler) => {
  return middy().use(cors()).handler(handler);
};
