import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column()
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  emergencyContact: string;

  @Column({ nullable: true })
  emergencyPhone: string;

  @Column({ nullable: true })
  insuranceProvider: string;

  @Column({ nullable: true })
  insurancePolicyNumber: string;

  @Column({ type: 'text', nullable: true })
  medicalHistory: string;

  @Column({ type: 'simple-array', nullable: true })
  allergies: string[];

  @Column({ default: 'O+' })
  bloodGroup: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
