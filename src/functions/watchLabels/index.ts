import { FunctionEntry } from '@definitions/types/functions.type';
import { handlerPath } from '@libs/handler-resolver';

const watchLabels: FunctionEntry = {
  handler: `${handlerPath(__dirname)}/handler.watchLabels`,
  events: [
    {
      schedule: 'rate(1 hour)',
    },
  ],
};

export default watchLabels;
