// import { Controller, Get, Post, Body } from '@nestjs/common';
// import { PatientService } from './patient.service';

// @Controller('patient')
// export class PatientController {
//   constructor(private readonly patientSerice: PatientService) {}

//   @Get()
//   findAll() {
//     console.log("reached");
//     return 'Working';
//     // return this.patientSerice.findAll();
//   }

//   @Post()
//   create(@Body('name') name: string) {
//     return this.patientSerice.create(name);
//   }
// }

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

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

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
  async create(@Body() body: { name: string; dob: string }): Promise<PatientEntity> {
    return this.patientService.create(body.name, new Date(body.dob));
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<{ name: string; dob: string }>
  ): Promise<PatientEntity> {
    const updates = {
      ...(body.name && { name: body.name }),
      ...(body.dob && { dob: new Date(body.dob) }),
    };

    const updated = await this.patientService.update(id, updates);
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
