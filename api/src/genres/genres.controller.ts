import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Controller('genres') // all routes start with /genres
export class GenresController {
  constructor(private genresService: GenresService) {}

  @Post() // POST /genres
  create(@Body() dto: CreateGenreDto) {
    return this.genresService.create(dto);
  }

  @Get() // GET /genres
  findAll() {
    return this.genresService.findAll();
  }

  // ParseIntPipe turns the id text into a number (and gives a 400 if it is not one)
  @Get(':id') // GET /genres/:id
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.genresService.findOne(id);
  }

  @Patch(':id') // PATCH /genres/:id
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGenreDto,
  ) {
    return this.genresService.update(id, dto);
  }

  @Delete(':id') // DELETE /genres/:id
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.genresService.remove(id);
  }
}