import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientModule } from './patient/patient.module';
import { MedicationModule } from './medication/medication.module';
import { AssignmentModule } from './assignment/assignment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    PatientModule,
    MedicationModule,
    AssignmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
