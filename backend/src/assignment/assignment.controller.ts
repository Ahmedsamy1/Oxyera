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
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

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
  async create(@Body() createAssignmentDto: CreateAssignmentDto): Promise<AssignmentEntity> {
    return this.assignmentService.create(
      createAssignmentDto.patientId,
      createAssignmentDto.medicationId,
      new Date(createAssignmentDto.startDate),
      createAssignmentDto.numberOfDays
    );
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAssignmentDto: UpdateAssignmentDto
  ): Promise<AssignmentEntity> {
    const updates = {
      patientId: updateAssignmentDto.patientId,
      medicationId: updateAssignmentDto.medicationId,
      startDate: new Date(updateAssignmentDto.startDate),
      numberOfDays: updateAssignmentDto.numberOfDays,
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