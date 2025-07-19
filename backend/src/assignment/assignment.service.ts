import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignmentEntity } from './assignment.entity';
import { PatientService } from '../patient/patient.service';
import { MedicationService } from '../medication/medication.service';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(AssignmentEntity)
    private assignmentRepo: Repository<AssignmentEntity>,
    private patientService: PatientService,
    private medicationService: MedicationService,
  ) { }

  async create(patientId: number, medicationId: number, startDate: Date, numberOfDays: number): Promise<AssignmentEntity | { error: string }> {
    // Check if patient exists
    const patient = await this.patientService.findOne(patientId);
    if (!patient) {
      return { error: `Patient with id ${patientId} does not exist` };
    }
    // Check if medication exists
    const medication = await this.medicationService.findOne(medicationId);
    if (!medication) {
      return { error: `Medication with id ${medicationId} does not exist` };
    }
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

  async getRemainingDaysById(id: number): Promise<{ assignment: AssignmentEntity; remainingDays: number } | null> {
    const assignment = await this.findOne(id);
    if (!assignment) {
      return null;
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
} 