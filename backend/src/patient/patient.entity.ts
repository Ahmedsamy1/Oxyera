// import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// @Entity()
export class PatientEntity {
  name: string;
  dob: Date;
  id: number;

  constructor(id: number, name: string, dob: Date) {
    this.id = id;
    this.name = name;
    this.dob = dob;
  }

  // getAge(): number {
  //   const today = new Date();
  //   const birthDate = new Date(this.dob);
  //   let age = today.getFullYear() - birthDate.getFullYear();
  //   const m = today.getMonth() - birthDate.getMonth();

  //   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
  //     age--;
  //   }

  //   return age;
  //   // @PrimaryGeneratedColumn()
  //   // id: number;

  //   // @Column()
  //   // name: string;
  // }
}
