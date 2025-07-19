import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from './patient.entity';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { AssignmentEntity } from '../assignment/assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PatientEntity, AssignmentEntity])],
  providers: [PatientService],
  controllers: [PatientController],
  exports: [PatientService],
})
export class PatientModule {}
