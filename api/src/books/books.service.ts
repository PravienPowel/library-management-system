import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  // create a book (a new book starts with every copy available)
  async create(dto: CreateBookDto) {
    await this.checkGenreExists(dto.genreId);
    await this.checkIsbnFree(dto.isbn);
    return this.prisma.book.create({
      data: { ...dto, availableCopies: dto.totalCopies },
      include: { genre: true },
    });
  }

  // get books with optional genre filter, search and pagination
  async findAll(genreId?: number, search?: string, page = 1, limit = 10) {
    // build the filter step by step
    const where: Prisma.BookWhereInput = {};

    if (genreId !== undefined) {
      where.genreId = genreId;
    }

    if (search) {
      // match the search text in the title OR the author (ignoring upper/lower case)
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    // skip = how many books to jump over, take = how many to return
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        skip,
        take: limit,
        orderBy: { title: 'asc' },
        include: { genre: true },
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // get one book (404 if not found)
  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  // update a book
  async update(id: number, dto: UpdateBookDto) {
    const book = await this.findOne(id); // throws 404 if it does not exist

    if (dto.genreId) {
      await this.checkGenreExists(dto.genreId);
    }
    if (dto.isbn) {
      await this.checkIsbnFree(dto.isbn, id);
    }

    const data: Prisma.BookUncheckedUpdateInput = { ...dto };

    // if the total changes, move the available copies by the same amount
    if (dto.totalCopies !== undefined) {
      const change = dto.totalCopies - book.totalCopies;
      data.availableCopies = Math.max(0, book.availableCopies + change);
    }

    return this.prisma.book.update({
      where: { id },
      data,
      include: { genre: true },
    });
  }

  // delete a book
  async remove(id: number) {
    await this.findOne(id); // throws 404 if it does not exist
    return this.prisma.book.delete({ where: { id } });
  }

  // helper: the genre must exist (404 if not)
  private async checkGenreExists(genreId: number) {
    const genre = await this.prisma.genre.findUnique({
      where: { id: genreId },
    });
    if (!genre) {
      throw new NotFoundException('Genre not found');
    }
  }

  // helper: the ISBN must not belong to another book (409 if it does)
  private async checkIsbnFree(isbn: string, ignoreBookId?: number) {
    const existing = await this.prisma.book.findUnique({ where: { isbn } });
    if (existing && existing.id !== ignoreBookId) {
      throw new ConflictException('A book with this ISBN already exists');
    }
  }
}