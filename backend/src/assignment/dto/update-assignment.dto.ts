import { IsNumber, IsDateString, IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateAssignmentDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  patientId: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  medicationId: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  numberOfDays: number;
} 