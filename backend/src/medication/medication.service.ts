import { MedicationEntity } from './medication.entity';

export class MedicationService {
  private medications: Map<number, MedicationEntity> = new Map();
  private currentId = 1;

  create(name: string, dosage: string, frequency: string): MedicationEntity {
    const medication: MedicationEntity = {
      id: this.currentId++,
      name,
      dosage,
      frequency,
    };
    this.medications.set(medication.id, medication);
    return medication;
  }

  findAll(): MedicationEntity[] {
    return Array.from(this.medications.values());
  }

  findOne(id: number): MedicationEntity | undefined {
    return this.medications.get(id);
  }

  update(id: number, updates: Partial<Omit<MedicationEntity, 'id'>>): MedicationEntity | null {
    const existing = this.medications.get(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates };
    this.medications.set(id, updated);
    return updated;
  }

  remove(id: number): boolean {
    return this.medications.delete(id);
  }
} 