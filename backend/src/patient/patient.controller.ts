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

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  findAll(): PatientEntity[] {
    return this.patientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): PatientEntity {
    const patient = this.patientService.findOne(id);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  @Post()
  create(@Body() body: { name: string; dob: string }): PatientEntity {
    return this.patientService.create(body.name, new Date(body.dob));
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<{ name: string; dob: string }>
  ): PatientEntity {
    const updates = {
      ...(body.name && { name: body.name }),
      ...(body.dob && { dob: new Date(body.dob) }),
    };

    const updated = this.patientService.update(id, updates);
    if (!updated) {
      throw new NotFoundException('Patient not found');
    }
    return updated;
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): void {
    const success = this.patientService.remove(id);
    if (!success) {
      throw new NotFoundException('Patient not found');
    }
  }
}
