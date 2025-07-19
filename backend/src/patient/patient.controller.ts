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
import { PatientService } from './patient.service';
import { PatientEntity } from './patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) { }

  @Get()
  async findAll(): Promise<PatientEntity[]> {
    return this.patientService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PatientEntity> {
    const patient = await this.patientService.findOne(id);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  @Post()
  async create(@Body() createPatientDto: CreatePatientDto): Promise<PatientEntity> {
    return this.patientService.create(
      createPatientDto.name,
      new Date(createPatientDto.dob)
    );
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePatientDto: UpdatePatientDto
  ): Promise<PatientEntity> {
    const updated = await this.patientService.update(id, {
      name: updatePatientDto.name,
      dob: new Date(updatePatientDto.dob),
    });
    if (!updated) {
      throw new NotFoundException('Patient not found');
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const success = await this.patientService.remove(id);
    if (!success) {
      throw new NotFoundException('Patient not found');
    }
  }
}
