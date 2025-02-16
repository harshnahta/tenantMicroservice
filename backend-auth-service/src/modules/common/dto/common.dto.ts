import {
  EVENT_LOG_MODEL,
  EVENT_LOG_TYPE,
} from '@common/constants/global.constants';

export class QueryFilter {
  key: string;
  mode?: string;
}
export class OrderByFilter {
  key: string;
  value: '-1' | '1' | '';
}
export class ListArgument {
  modelName: string;
  page: number;
  limit: number;
  query?: string;
  orderData?: Array<OrderByFilter>;
  filterData?: Array<QueryFilter>;
  includeData?: {
    [key: string]: any;
  };
  whereData?: {
    [key: string]: any;
  };
}

export class EventLogProps {
  type: EVENT_LOG_TYPE;
  model: EVENT_LOG_MODEL;
  modelId: string;
  performBy: string;
}
