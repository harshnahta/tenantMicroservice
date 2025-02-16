import { IsNotEmpty, IsString, IsNumber, IsArray, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Price must be greater than 0' })
  @ApiProperty({
    example: 10,
    description: 'Product price must be greater than 0',
  })
  price: number;
}

export class GetProductDTO {
  @IsNumber()
  @ApiProperty()
  page: number;

  @IsNumber()
  @ApiProperty()
  limit: number;

  @ApiProperty()
  keyword?: string;

  @ApiProperty()
  sort?: string;

  @ApiProperty()
  filter?: {
    [key: string]: unknown;
  };
}

export class GetProductDetailDTO {
  @IsString()
  @ApiProperty()
  id: string;
}

export class DeleteProductDTO {
  @IsArray()
  @ApiProperty()
  id: string;
}

export class UpdateProductDTO {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @ApiProperty()
  price: number;
}
