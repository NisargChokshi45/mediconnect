import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { logger } from '../config/logger';
import { User } from '../entities/User';
import { Patient } from '../entities/Patient';
import { Doctor } from '../entities/Doctor';
import { Appointment } from '../entities/Appointment';
import { Note } from '../entities/Note';
import { UserRole, AppointmentStatus } from '../types/enums';
import * as bcrypt from 'bcrypt';

async function seed() {
  try {
    await AppDataSource.initialize();
    logger.info('Database connected for seeding');

    // Clear existing data
    await AppDataSource.getRepository(Note).delete({});
    await AppDataSource.getRepository(Appointment).delete({});
    await AppDataSource.getRepository(Patient).delete({});
    await AppDataSource.getRepository(Doctor).delete({});
    await AppDataSource.getRepository(User).delete({});

    logger.info('Cleared existing data');

    const userRepo = AppDataSource.getRepository(User);
    const patientRepo = AppDataSource.getRepository(Patient);
    const doctorRepo = AppDataSource.getRepository(Doctor);
    const appointmentRepo = AppDataSource.getRepository(Appointment);
    const noteRepo = AppDataSource.getRepository(Note);

    const passwordHash = await bcrypt.hash('password123', 10);

    // Create Patient Users
    const patient1User = await userRepo.save({
      email: 'john.doe@example.com',
      passwordHash,
      role: UserRole.PATIENT,
      isActive: true,
    });

    const patient2User = await userRepo.save({
      email: 'jane.smith@example.com',
      passwordHash,
      role: UserRole.PATIENT,
      isActive: true,
    });

    // Create Patients
    const patient1 = await patientRepo.save({
      userId: patient1User.id,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1985-06-15'),
      phone: '+1-555-0101',
      address: '123 Main St, New York, NY 10001',
      emergencyContact: 'Mary Doe',
      emergencyPhone: '+1-555-0102',
      insuranceProvider: 'Blue Cross',
      insurancePolicyNumber: 'BC-123456789',
    });

    const patient2 = await patientRepo.save({
      userId: patient2User.id,
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: new Date('1990-03-22'),
      phone: '+1-555-0201',
      address: '456 Oak Ave, Los Angeles, CA 90001',
      emergencyContact: 'Bob Smith',
      emergencyPhone: '+1-555-0202',
      insuranceProvider: 'United Health',
      insurancePolicyNumber: 'UH-987654321',
    });

    // Create Doctor Users
    const doctor1User = await userRepo.save({
      email: 'dr.williams@mediconnect.com',
      passwordHash,
      role: UserRole.DOCTOR,
      isActive: true,
    });

    const doctor2User = await userRepo.save({
      email: 'dr.johnson@mediconnect.com',
      passwordHash,
      role: UserRole.DOCTOR,
      isActive: true,
    });

    // Create Doctors
    const doctor1 = await doctorRepo.save({
      userId: doctor1User.id,
      firstName: 'Sarah',
      lastName: 'Williams',
      specialization: 'Cardiology',
      licenseNumber: 'MD-CARD-12345',
      phone: '+1-555-0301',
      officeAddress: '789 Medical Plaza, New York, NY 10002',
      qualifications: ['MD', 'Board Certified Cardiologist', 'FACC'],
      consultationDuration: 30,
    });

    const doctor2 = await doctorRepo.save({
      userId: doctor2User.id,
      firstName: 'Michael',
      lastName: 'Johnson',
      specialization: 'General Practice',
      licenseNumber: 'MD-GP-67890',
      phone: '+1-555-0401',
      officeAddress: '321 Health Center, Los Angeles, CA 90002',
      qualifications: ['MD', 'Board Certified Family Medicine'],
      consultationDuration: 15,
    });

    // Create Appointments
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(14, 0, 0, 0);

    await appointmentRepo.save({
      patientId: patient1.id,
      doctorId: doctor1.id,
      scheduledAt: tomorrow,
      durationMinutes: 30,
      status: AppointmentStatus.SCHEDULED,
      reasonForVisit: 'Annual cardiac checkup',
      insuranceVerified: true,
    });

    await appointmentRepo.save({
      patientId: patient2.id,
      doctorId: doctor2.id,
      scheduledAt: nextWeek,
      durationMinutes: 15,
      status: AppointmentStatus.CONFIRMED,
      reasonForVisit: 'Follow-up consultation',
      insuranceVerified: true,
    });

    // Create a past completed appointment with a note
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 7);
    pastDate.setHours(9, 0, 0, 0);

    const completedAppointment = await appointmentRepo.save({
      patientId: patient2.id,
      doctorId: doctor2.id,
      scheduledAt: pastDate,
      durationMinutes: 15,
      status: AppointmentStatus.COMPLETED,
      reasonForVisit: 'Annual physical',
      insuranceVerified: true,
    });

    // Create Clinical Note
    await noteRepo.save({
      appointmentId: completedAppointment.id,
      doctorId: doctor2.id,
      chiefComplaint: 'Routine annual physical examination',
      historyOfPresentIllness: 'Patient reports feeling well overall with no new symptoms',
      physicalExamination: 'Vital signs normal. General appearance healthy.',
      diagnosis: 'Healthy adult',
      treatmentPlan: 'Continue current lifestyle. Return in 1 year for follow-up.',
      medications: 'None',
      followUpInstructions: 'Schedule annual physical in 12 months',
    });

    logger.info('Seed data created successfully');
    logger.info(`Created ${2} patients, ${2} doctors, ${3} appointments, and ${1} clinical note`);
    logger.info('Sample credentials - Email: john.doe@example.com, Password: password123');
    logger.info('Sample credentials - Email: dr.williams@mediconnect.com, Password: password123');

    await AppDataSource.destroy();
  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  }
}

seed();
