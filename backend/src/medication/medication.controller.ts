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
  async findAll(): Promise<MedicationEntity[]> {
    return this.medicationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<MedicationEntity> {
    const medication = await this.medicationService.findOne(id);
    if (!medication) {
      throw new NotFoundException('Medication not found');
    }
    return medication;
  }

  @Post()
  async create(@Body() body: { name: string; dosage: string; frequency: string }): Promise<MedicationEntity> {
    return this.medicationService.create(body.name, body.dosage, body.frequency);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<{ name: string; dosage: string; frequency: string }>
  ): Promise<MedicationEntity> {
    const updates = {
      ...(body.name && { name: body.name }),
      ...(body.dosage && { dosage: body.dosage }),
      ...(body.frequency && { frequency: body.frequency }),
    };

    const updated = await this.medicationService.update(id, updates);
    if (!updated) {
      throw new NotFoundException('Medication not found');
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const success = await this.medicationService.remove(id);
    if (!success) {
      throw new NotFoundException('Medication not found');
    }
  }
} 