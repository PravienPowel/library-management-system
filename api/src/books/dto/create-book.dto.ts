import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  author!: string;

  @IsString()
  @IsNotEmpty()
  isbn!: string;

  // how many copies the library owns, at least 1
  @IsInt()
  @Min(1)
  totalCopies!: number;

  // id of an existing genre
  @IsInt()
  @Min(1)
  genreId!: number;
}