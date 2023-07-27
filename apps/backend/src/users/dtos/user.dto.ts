import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  userId: number;

  @Expose()
  email: string;

  @Expose()
  role: string;

  @Expose()
  documents: any[];
}
