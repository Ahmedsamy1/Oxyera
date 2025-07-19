import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientEntity } from './patient.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientEntity)
    private patientRepo: Repository<PatientEntity>,
  ) {}

  async create(name: string, dob: Date): Promise<PatientEntity> {
    const patient = this.patientRepo.create({ name, dob });
    return this.patientRepo.save(patient);
  }

  async findAll(): Promise<PatientEntity[]> {
    return this.patientRepo.find();
  }

  async findOne(id: number): Promise<PatientEntity | null> {
    return this.patientRepo.findOne({ where: { id } });
  }

  async update(id: number, updates: Partial<Omit<PatientEntity, 'id'>>): Promise<PatientEntity | null> {
    const existing = await this.patientRepo.findOne({ where: { id } });
    if (!existing) return null;

    Object.assign(existing, updates);
    return this.patientRepo.save(existing);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.patientRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
