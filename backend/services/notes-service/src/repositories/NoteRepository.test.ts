import { NoteRepository } from './NoteRepository';
import { AppDataSource } from '../config/database';

jest.mock('../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('NoteRepository', () => {
  let noteRepository: NoteRepository;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    noteRepository = new NoteRepository();
  });

  it('should find note by id', async () => {
    mockRepo.findOne.mockResolvedValue({ id: '1' });
    const result = await noteRepository.findById('1');
    expect(result).toEqual({ id: '1' });
  });

  it('should find by appointment id', async () => {
    mockRepo.find.mockResolvedValue([]);
    await noteRepository.findByAppointmentId('a1');
    expect(mockRepo.find).toHaveBeenCalledWith({ where: { appointmentId: 'a1' }, order: { createdAt: 'DESC' } });
  });

  it('should find by doctor id', async () => {
    mockRepo.find.mockResolvedValue([]);
    await noteRepository.findByDoctorId('d1');
    expect(mockRepo.find).toHaveBeenCalledWith({ where: { doctorId: 'd1' }, order: { createdAt: 'DESC' } });
  });

  it('should create note', async () => {
    mockRepo.create.mockReturnValue({ id: '1' });
    mockRepo.save.mockResolvedValue({ id: '1' });
    const result = await noteRepository.create({});
    expect(result.id).toBe('1');
  });

  it('should update note', async () => {
    mockRepo.update.mockResolvedValue({});
    mockRepo.findOne.mockResolvedValue({ id: '1' });
    const result = await noteRepository.update('1', {});
    expect(result).toEqual({ id: '1' });
  });

  it('should delete note', async () => {
    await noteRepository.delete('1');
    expect(mockRepo.delete).toHaveBeenCalledWith('1');
  });
});
