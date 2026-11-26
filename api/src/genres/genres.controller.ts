import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('genres') // all routes start with /genres
export class GenresController {
  constructor(private genresService: GenresService) {}

  // only a logged in LIBRARIAN can create a genre
  @Post() // POST /genres
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  create(@Body() dto: CreateGenreDto) {
    return this.genresService.create(dto);
  }

  @Get() // GET /genres (open to everyone)
  findAll() {
    return this.genresService.findAll();
  }

  @Get(':id') // GET /genres/:id (open to everyone)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.genresService.findOne(id);
  }

  // only a logged in LIBRARIAN can update a genre
  @Patch(':id') // PATCH /genres/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGenreDto,
  ) {
    return this.genresService.update(id, dto);
  }

  // only a logged in LIBRARIAN can delete a genre
  @Delete(':id') // DELETE /genres/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.genresService.remove(id);
  }
}