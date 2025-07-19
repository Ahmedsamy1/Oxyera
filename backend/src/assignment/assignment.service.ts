import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignmentEntity } from './assignment.entity';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(AssignmentEntity)
    private assignmentRepo: Repository<AssignmentEntity>,
  ) {}

  async create(patientId: number, medicationId: number, startDate: Date, numberOfDays: number): Promise<AssignmentEntity> {
    const assignment = this.assignmentRepo.create({ patientId, medicationId, startDate, numberOfDays });
    return this.assignmentRepo.save(assignment);
  }

  async findAll(): Promise<AssignmentEntity[]> {
    return this.assignmentRepo.find();
  }

  async findOne(id: number): Promise<AssignmentEntity | null> {
    return this.assignmentRepo.findOne({ where: { id } });
  }

  async findByPatientId(patientId: number): Promise<AssignmentEntity[]> {
    return this.assignmentRepo.find({ where: { patientId } });
  }

  async update(id: number, updates: Partial<Omit<AssignmentEntity, 'id'>>): Promise<AssignmentEntity | null> {
    const existing = await this.assignmentRepo.findOne({ where: { id } });
    if (!existing) return null;

    Object.assign(existing, updates);
    return this.assignmentRepo.save(existing);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.assignmentRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }
} 