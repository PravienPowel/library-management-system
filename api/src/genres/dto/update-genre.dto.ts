import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateGenreDto {
  // on update, name is optional, but if sent it must still be valid
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
}