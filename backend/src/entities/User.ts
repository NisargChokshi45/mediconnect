import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { UserRole } from '../types/enums';
import { Patient } from './Patient';
import { Doctor } from './Doctor';
import { AuditLog } from './AuditLog';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Patient, (patient) => patient.user, { nullable: true })
  patient?: Patient;

  @OneToOne(() => Doctor, (doctor) => doctor.user, { nullable: true })
  doctor?: Doctor;

  @OneToMany(() => AuditLog, (log) => log.user)
  auditLogs: AuditLog[];
}
