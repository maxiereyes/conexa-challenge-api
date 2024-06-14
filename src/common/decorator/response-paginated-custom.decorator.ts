import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PageMetaDto } from 'src/common/dtos/pagination/page-meta.dto';
import { ResponseFormat } from 'src/common/response-interceptor/response-interceptor';

export const ApiResponsePaginatedCustom = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(ResponseFormat, model, PageMetaDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseFormat) },
          {
            properties: {
              results: {
                properties: {
                  data: { $ref: getSchemaPath(model) },
                  meta: { $ref: getSchemaPath(PageMetaDto) },
                },
              },
            },
          },
        ],
      },
    }),
  );
};
