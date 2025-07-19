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
import { AssignmentService } from './assignment.service';
import { AssignmentEntity } from './assignment.entity';

@Controller('assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) { }

  @Get()
  async findAll(): Promise<AssignmentEntity[]> {
    return this.assignmentService.findAll();
  }

  @Get('remaining-days')
  async getRemainingDays(): Promise<Array<{ assignment: AssignmentEntity; remainingDays: number }>> {
    const today = new Date();
    const assignments = await this.assignmentService.findAll();
    return assignments.map(assignment => {
      const endDate = new Date(assignment.startDate);
      endDate.setDate(endDate.getDate() + assignment.numberOfDays);
      const diffTime = endDate.getTime() - today.getTime();
      const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        assignment,
        remainingDays: remainingDays > 0 ? remainingDays : 0,
      };
    });
  }

  @Get(':id/remaining-days')
  async getRemainingDaysById(@Param('id', ParseIntPipe) id: number): Promise<{ assignment: AssignmentEntity; remainingDays: number }> {
    const assignment = await this.assignmentService.findOne(id);
    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    const today = new Date();
    const endDate = new Date(assignment.startDate);
    endDate.setDate(endDate.getDate() + assignment.numberOfDays);
    const diffTime = endDate.getTime() - today.getTime();
    const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      assignment,
      remainingDays: remainingDays > 0 ? remainingDays : 0,
    };
  }

  @Get('patient/:patientId')
  async findByPatientId(@Param('patientId', ParseIntPipe) patientId: number): Promise<AssignmentEntity[]> {
    return this.assignmentService.findByPatientId(patientId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<AssignmentEntity> {
    const assignment = await this.assignmentService.findOne(id);
    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }
    return assignment;
  }

  @Post()
  async create(@Body() body: { patientId: number; medicationId: number; startDate: string; numberOfDays: number }): Promise<AssignmentEntity> {
    return this.assignmentService.create(
      body.patientId,
      body.medicationId,
      new Date(body.startDate),
      body.numberOfDays
    );
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<{ patientId: number; medicationId: number; startDate: string; numberOfDays: number }>
  ): Promise<AssignmentEntity> {
    const updates = {
      ...(body.patientId !== undefined && { patientId: body.patientId }),
      ...(body.medicationId !== undefined && { medicationId: body.medicationId }),
      ...(body.startDate && { startDate: new Date(body.startDate) }),
      ...(body.numberOfDays !== undefined && { numberOfDays: body.numberOfDays }),
    };

    const updated = await this.assignmentService.update(id, updates);
    if (!updated) {
      throw new NotFoundException('Assignment not found');
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const success = await this.assignmentService.remove(id);
    if (!success) {
      throw new NotFoundException('Assignment not found');
    }
  }
} 