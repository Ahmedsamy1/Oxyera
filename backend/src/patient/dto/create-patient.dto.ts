import { IsString, IsNotEmpty, Validate } from 'class-validator';
import { IsValidDate } from '../validators/is-valid-date.validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsValidDate)
  dob: string;
} 