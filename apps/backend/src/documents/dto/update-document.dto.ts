import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateDocumentDto } from './create-document.dto';
import { Status } from '../entities/document.entity';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
  @ApiProperty()
  @IsNotEmpty()
  status: Status;

  @ApiProperty()
  @IsNotEmpty()
  hash: string;

  @ApiProperty()
  @IsOptional()
  certifiedHash: string;
}
