import { Injectable } from '@nestjs/common';
import {
  QueryFilter,
  ListArgument,
  OrderByFilter,
  EventLogProps,
} from './dto/common.dto';
import { PrismaSelectService } from '@providers/prisma/prisma-select.service';
import { CATEGORY_DEPTH_LIMIT } from '@common/constants/global.constants';
@Injectable()
export class CommonService {
  constructor(private prisma: PrismaSelectService) {}
  genrateQueryFilter(data: Array<QueryFilter>, value: string) {
    const returnData = {};
    if (data.length === 0) {
      return returnData;
    }
    if (data.length > 1) {
      const ORData = [];
      data.forEach((item) => {
        const tempData = {};
        tempData[item.key] = {
          contains: value,
        };
        if (item.mode) {
          tempData[item.key]['mode'] = item.mode;
        }
        ORData.push(tempData);
      });
      returnData['OR'] = ORData;
    } else {
      const [tempData] = data;
      returnData[tempData.key] = {
        contains: value,
      };
      if (tempData.mode) {
        returnData[tempData.key]['mode'] = tempData.mode;
      }
    }
    return returnData;
  }

  genrateOrderData(data: Array<OrderByFilter>) {
    const returnData = [];
    if (data.length === 0) {
      return returnData;
    }
    data.forEach((item) => {
      if (item.value) {
        returnData.push({ [item.key]: item.value === '1' ? 'asc' : 'desc' });
      }
    });
    return returnData;
  }

  getCategoryParentDepth() {
    const returnData = {};
    let current = returnData;
    for (let i = 0; i < CATEGORY_DEPTH_LIMIT; ++i) {
      if (i == CATEGORY_DEPTH_LIMIT - 1) {
        current['include'] = {
          parent: true,
        };
      } else {
        current['include'] = {
          parent: {},
        };
        current = current['include']['parent'];
      }
    }
    return returnData;
  }
  getAllCategoryChildDepth() {
    const returnData = {};
    let current = returnData;
    for (let i = 0; i <= CATEGORY_DEPTH_LIMIT; ++i) {
      if (i == CATEGORY_DEPTH_LIMIT) {
        current['include'] = {
          children: true,
        };
      } else {
        current['include'] = {
          children: {
            where: {
              status: true,
              deleted: false,
            },
          },
        };
        current = current['include']['children'];
      }
    }
    return returnData;
  }

  getAdsParentDepth(slug: string) {
    return [
      {
        category: {
          slug: slug,
        },
      },
      {
        category: {
          parent: {
            slug: slug,
          },
        },
      },
      {
        category: {
          parent: {
            parent: {
              slug: slug,
            },
          },
        },
      },
    ];
  }
  getAdsChildDepth(slug: string) {
    return [
      {
        category: {
          slug: slug,
        },
      },
      // {
      //   category: {
      //     children: {
      //       some: {
      //         deleted: false,
      //         status: true,
      //         slug: slug,
      //       },
      //     },
      //   },
      // },
      // {
      //   category: {
      //     children: {
      //       some: {
      //         deleted: false,
      //         status: true,
      //         children: {
      //           some: {
      //             deleted: false,
      //             status: true,
      //             slug: slug,
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
    ];
  }

  async genrateAllList(args: ListArgument) {
    const {
      modelName,
      limit,
      page,
      query = '',
      whereData = {},
      includeData = {},
      orderData = [],
      filterData = [],
    } = args;
    const where = whereData;
    const orderBy = this.genrateOrderData(orderData);
    if (query) {
      Object.assign(where, this.genrateQueryFilter(filterData, query));
    }
    const finalData = {
      where,
      include: includeData,
      orderBy: orderBy,
      skip: (page - 1) * limit,
      take: limit,
    };
    if (!Object.keys(includeData).length) {
      delete finalData.include;
    }
    console.log(JSON.stringify(where, null, 4));
    const [totalRecords, data] = await Promise.all([
      this.prisma.count(modelName, {
        where,
      }),
      this.prisma.findMany(modelName, finalData),
    ]);
    return { totalRecords, data };
  }

  async genrateEventLog(args: EventLogProps) {
    // await this.prisma.save('EventLogs', args);
  }

  timeConvert(n: number) {
    const num = n;
    const hours = num / 60;
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);
    return `${
      rhours > 0 ? `${rhours} ${rhours > 1 ? ' hours' : 'hours'} ` : ''
    }${
      rminutes > 0
        ? `${rhours > 0 ? 'and ' : ''}${rminutes} ${
            rminutes > 1 ? 'minutes' : 'minute'
          }`
        : ''
    }`;
  }

  async genrateList(args: ListArgument) {
    const {
      modelName,
      limit,
      page,
      query = '',
      whereData = {},
      orderData = [],
      filterData = [],
    } = args;

    const where = whereData;

    const orderBy = this.genrateOrderData(orderData);
    if (query) {
      Object.assign(where, this.genrateQueryFilter(filterData, query));
    }
    const finalData = {
      where,

      include: {
        children: {
          where: {
            status: true,
            deleted: false,
            OR: [
              {
                Ads: {
                  some: {
                    status: 'ACTIVE',
                  },
                },
              },
              {
                children: {
                  some: {
                    status: true,
                    deleted: false,
                    Ads: {
                      some: {
                        status: 'ACTIVE',
                      },
                    },
                  },
                },
              },
            ],
          },
          include: {
            children: {
              where: {
                status: true,
                deleted: false,
                Ads: {
                  some: {
                    status: 'ACTIVE',
                  },
                },
              },
            },
          },
        },
      },
      orderBy: orderBy,
      skip: (page - 1) * limit,
      take: limit,
    };

    const [totalRecords, data] = await Promise.all([
      this.prisma.count(modelName, {
        where,
      }),
      this.prisma.findMany(modelName, finalData),
    ]);
    return { totalRecords, data };
  }
}
