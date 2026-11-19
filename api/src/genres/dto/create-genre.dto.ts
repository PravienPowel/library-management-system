import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGenreDto {
  // name is required and must be text
  @IsString()
  @IsNotEmpty()
  name!: string;
}