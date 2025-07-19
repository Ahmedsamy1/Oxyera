import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MedicationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  dosage: string;

  @Column()
  frequency: string;

  constructor(id?: number, name?: string, dosage?: string, frequency?: string) {
    if (id) this.id = id;
    if (name) this.name = name;
    if (dosage) this.dosage = dosage;
    if (frequency) this.frequency = frequency;
  }
} 