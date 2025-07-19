import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationEntity } from './medication.entity';
import { MedicationService } from './medication.service';
import { MedicationController } from './medication.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MedicationEntity])],
  providers: [MedicationService],
  controllers: [MedicationController],
})
export class MedicationModule {} 