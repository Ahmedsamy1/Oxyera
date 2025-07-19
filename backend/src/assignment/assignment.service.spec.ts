import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignmentService } from './assignment.service';
import { AssignmentEntity } from './assignment.entity';

describe('AssignmentService', () => {
    let service: AssignmentService;
    let repository: Repository<AssignmentEntity>;

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AssignmentService,
                {
                    provide: getRepositoryToken(AssignmentEntity),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<AssignmentService>(AssignmentService);
        repository = module.get<Repository<AssignmentEntity>>(getRepositoryToken(AssignmentEntity));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getRemainingDaysById', () => {
        it('should return 0 remaining days for an expired assignment', async () => {
            // Mock assignment data
            const mockAssignment = new AssignmentEntity();
            mockAssignment.id = 1;
            mockAssignment.patientId = 1;
            mockAssignment.medicationId = 1;
            mockAssignment.startDate = new Date('2024-01-01');
            mockAssignment.numberOfDays = 10;

            // Mock the findOne method to return our test assignment
            mockRepository.findOne = jest.fn().mockResolvedValue(mockAssignment);

            // Mock current date to be 15 days after start date (5 days after expiration)
            const mockDate = new Date('2024-01-16');
            jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

            const result = await service.getRemainingDaysById(1);

            expect(result).toBeDefined();
            expect(result?.assignment).toEqual(mockAssignment);
            expect(result?.remainingDays).toBe(0); // Expired assignment should return 0
        });

        it('should return null for non-existent assignment', async () => {
            // Mock the findOne method to return null (assignment not found)
            mockRepository.findOne = jest.fn().mockResolvedValue(null);

            const result = await service.getRemainingDaysById(999);

            expect(result).toBeNull();
        });

        it('should calculate remaining days correctly for assignment ending today', async () => {
            // Mock assignment data
            const mockAssignment = new AssignmentEntity();
            mockAssignment.id = 1;
            mockAssignment.patientId = 1;
            mockAssignment.medicationId = 1;
            mockAssignment.startDate = new Date('2024-01-01');
            mockAssignment.numberOfDays = 10;

            // Mock the findOne method to return our test assignment
            mockRepository.findOne = jest.fn().mockResolvedValue(mockAssignment);

            // Mock current date to be exactly 10 days after start date (end date)
            const mockDate = new Date('2024-01-11');
            jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

            const result = await service.getRemainingDaysById(1);

            expect(result).toBeDefined();
            expect(result?.assignment).toEqual(mockAssignment);
            expect(result?.remainingDays).toBe(0); // Should return 0 when ending today
        });
    });
}); 