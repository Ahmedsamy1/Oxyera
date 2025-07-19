import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AssignmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientId: number;

  @Column()
  medicationId: number;

  @Column('date')
  startDate: Date;

  @Column()
  numberOfDays: number;

  constructor(id?: number, patientId?: number, medicationId?: number, startDate?: Date, numberOfDays?: number) {
    if (id) this.id = id;
    if (patientId) this.patientId = patientId;
    if (medicationId) this.medicationId = medicationId;
    if (startDate) this.startDate = startDate;
    if (numberOfDays) this.numberOfDays = numberOfDays;
  }
} 