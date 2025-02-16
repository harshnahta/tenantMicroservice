import {
  // BadRequestException,
  UnprocessableEntityException,
  ValidationError,
  // ValidationPipe,
  // ValidationPipeOptions,
} from '@nestjs/common';
// import { GraphQLError } from 'graphql';

/**
 * The class-validator package does not support i18n and thus we will
 * translate the error messages ourselves.
 */
export const translateErrors = (validationErrors: ValidationError[]) => {
  const error_messages = validationErrors.reduce((vl: any, val: any) => {
    vl[val.property] = Object.values(val.constraints);
    return vl;
  }, {});
  const errrors = {
    message: 'Validation Error',
    error: error_messages,
  };
  return new UnprocessableEntityException(errrors);
};
