import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicationEntity } from './medication.entity';

@Injectable()
export class MedicationService {
  constructor(
    @InjectRepository(MedicationEntity)
    private medicationRepo: Repository<MedicationEntity>,
  ) {}

  async create(name: string, dosage: string, frequency: string): Promise<MedicationEntity> {
    const medication = this.medicationRepo.create({ name, dosage, frequency });
    return this.medicationRepo.save(medication);
  }

  async findAll(): Promise<MedicationEntity[]> {
    return this.medicationRepo.find();
  }

  async findOne(id: number): Promise<MedicationEntity | null> {
    return this.medicationRepo.findOne({ where: { id } });
  }

  async update(id: number, updates: Partial<Omit<MedicationEntity, 'id'>>): Promise<MedicationEntity | null> {
    const existing = await this.medicationRepo.findOne({ where: { id } });
    if (!existing) return null;

    Object.assign(existing, updates);
    return this.medicationRepo.save(existing);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.medicationRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }
} 