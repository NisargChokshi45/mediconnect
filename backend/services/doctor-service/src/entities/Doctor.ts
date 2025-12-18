import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  specialization: string;

  @Column({ unique: true })
  licenseNumber: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  officeAddress: string;

  @Column({ type: 'simple-array', nullable: true })
  qualifications: string[];

  @Column({ type: 'int', default: 30 })
  consultationDuration: number;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'int', default: 0 })
  yearsOfExperience: number;

  @Column({ default: true })
  isAcceptingPatients: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
