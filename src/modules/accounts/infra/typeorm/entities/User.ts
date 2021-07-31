import { v4 as uuid } from 'uuid';
import { Expose } from 'class-transformer'
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
class User {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  driver_license: string;

  @Column()
  admin: boolean;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url' })

  getAvatarUrl(): string {
    switch(process.env.DISK) {
      case 'local':
        return `${process.env.API_TEST_BASE_URL}/profiles/${this.avatar}`;
      case 's3':
        return `${process.env.AWS_BUCKET_URL}/avatar-images/${this.avatar}`;
      default:
        return null;
    }
  }

  constructor() {
    if (!this.id) {
      this.id = uuid();
    };
  }
}

export default User;