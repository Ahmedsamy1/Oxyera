import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { MedicationService } from './medication.service';
import { MedicationEntity } from './medication.entity';

@Controller('medication')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  @Get()
  findAll(): MedicationEntity[] {
    return this.medicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): MedicationEntity {
    const medication = this.medicationService.findOne(id);
    if (!medication) {
      throw new NotFoundException('Medication not found');
    }
    return medication;
  }

  @Post()
  create(@Body() body: { name: string; dosage: string; frequency: string }): MedicationEntity {
    return this.medicationService.create(body.name, body.dosage, body.frequency);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<{ name: string; dosage: string; frequency: string }>
  ): MedicationEntity {
    const updates = {
      ...(body.name && { name: body.name }),
      ...(body.dosage && { dosage: body.dosage }),
      ...(body.frequency && { frequency: body.frequency }),
    };

    const updated = this.medicationService.update(id, updates);
    if (!updated) {
      throw new NotFoundException('Medication not found');
    }
    return updated;
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): void {
    const success = this.medicationService.remove(id);
    if (!success) {
      throw new NotFoundException('Medication not found');
    }
  }
} 