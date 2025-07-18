import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientEntity } from './patient.entity';

@Injectable()
export class PatientService {
  private patients: Map<number, PatientEntity> = new Map();
  private currentId = 1;

  create(name: string, dob: Date): PatientEntity {
    const patient: PatientEntity = {
      id: this.currentId++,
      name,
      dob,
    };
    this.patients.set(patient.id, patient);
    return patient;
  }

  findAll(): PatientEntity[] {
    return Array.from(this.patients.values());
  }

  findOne(id: number): PatientEntity | undefined {
    return this.patients.get(id);
  }

  update(id: number, updates: Partial<Omit<PatientEntity, 'id'>>): PatientEntity | null {
    const existing = this.patients.get(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates };
    this.patients.set(id, updated);
    return updated;
  }

  remove(id: number): boolean {
    return this.patients.delete(id);
  }
}

// @Injectable()
// export class PatientService {
//   constructor(
//     @InjectRepository(PatientEntity)
//     private patientRepo: Repository<PatientEntity>,
//   ) {}

//   async create(name: string): Promise<PatientEntity> {
//     const entity = this.patientRepo.create({ name });
//     return this.patientRepo.save(entity);
//   }

//   async findAll(): Promise<PatientEntity[]> {
//     return this.patientRepo.find();
//   }
// }
