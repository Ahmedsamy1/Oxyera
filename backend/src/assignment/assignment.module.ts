import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentEntity } from './assignment.entity';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AssignmentEntity])],
  providers: [AssignmentService],
  controllers: [AssignmentController],
})
export class AssignmentModule {} 