export class MedicationEntity {
  id: number;
  name: string;
  dosage: string;
  frequency: string;

  constructor(id: number, name: string, dosage: string, frequency: string) {
    this.id = id;
    this.name = name;
    this.dosage = dosage;
    this.frequency = frequency;
  }
} 