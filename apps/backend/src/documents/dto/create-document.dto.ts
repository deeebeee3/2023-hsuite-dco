import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  paternalSurname: string;

  @ApiProperty()
  @IsNotEmpty()
  maternalSurname: string;

  @ApiProperty()
  @IsNotEmpty()
  sex: string;

  @ApiProperty()
  @IsNotEmpty()
  nativity: string;

  @ApiProperty()
  @IsNotEmpty()
  countryNationality: string;

  @ApiProperty()
  @IsNotEmpty()
  countryCitizenship: string;

  @ApiProperty()
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty()
  @IsNotEmpty()
  cityOfBirth: string;

  @ApiProperty()
  @IsNotEmpty()
  addressResidency: string;

  @ApiProperty()
  @IsNotEmpty()
  addressDomicile: string;

  @ApiProperty()
  @IsNotEmpty()
  idPassport: string;

  @ApiProperty()
  @IsOptional()
  driversLicenceNumber: string;

  @ApiProperty()
  @IsOptional()
  notes: string;
}
