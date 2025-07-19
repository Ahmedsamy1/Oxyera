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
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

@Controller('medication')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) { }

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
  async create(@Body() createMedicationDto: CreateMedicationDto): Promise<MedicationEntity> {
    return this.medicationService.create(
      createMedicationDto.name,
      createMedicationDto.dosage,
      createMedicationDto.frequency
    );
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMedicationDto: UpdateMedicationDto
  ): Promise<MedicationEntity> {
    const updated = await this.medicationService.update(id, {
      name: updateMedicationDto.name,
      dosage: updateMedicationDto.dosage,
      frequency: updateMedicationDto.frequency,
    });
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