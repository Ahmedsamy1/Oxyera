import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PatientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('date')
  dob: Date;

  constructor(id?: number, name?: string, dob?: Date) {
    if (id) this.id = id;
    if (name) this.name = name;
    if (dob) this.dob = dob;
  }
}
