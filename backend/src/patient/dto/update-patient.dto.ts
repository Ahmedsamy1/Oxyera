import { IsString, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePatientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  dob: string;
} 