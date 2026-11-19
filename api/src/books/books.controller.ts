import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('books') // all routes start with /books
export class BooksController {
  constructor(private booksService: BooksService) {}

  // only a logged in LIBRARIAN can create a book
  // JwtAuthGuard checks the token first, then RolesGuard checks the role
  @Post() // POST /books
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  // GET /books?genreId=...&search=...&page=1&limit=10 (open to everyone)
  @Get()
  findAll(
    @Query('genreId') genreId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    // genreId arrives as text, so turn it into a number
    let genreIdNumber: number | undefined;
    if (genreId) {
      genreIdNumber = Number(genreId);
      if (!Number.isInteger(genreIdNumber)) {
        throw new BadRequestException('genreId must be a number');
      }
    }

    // if page or limit are missing or invalid, use safe defaults (page 1, limit 10, max 100)
    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 100);

    return this.booksService.findAll(
      genreIdNumber,
      search,
      pageNumber,
      limitNumber,
    );
  }

  @Get(':id') // GET /books/:id (open to everyone)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  // only a logged in LIBRARIAN can update a book
  @Patch(':id') // PATCH /books/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookDto,
  ) {
    return this.booksService.update(id, dto);
  }

  // only a logged in LIBRARIAN can delete a book
  @Delete(':id') // DELETE /books/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.remove(id);
  }
}