import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  // create a genre (the slug is made from the name, 409 if name or slug is taken)
  async create(dto: CreateGenreDto) {
    const slug = this.makeSlug(dto.name);
    await this.checkFree(dto.name, slug);
    return this.prisma.genre.create({ data: { name: dto.name, slug } });
  }

  // get all genres
  findAll() {
    return this.prisma.genre.findMany({ orderBy: { name: 'asc' } });
  }

  // get one genre by id (404 if not found)
  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({ where: { id } });
    if (!genre) {
      throw new NotFoundException('Genre not found');
    }
    return genre;
  }

  // update a genre
  async update(id: number, dto: UpdateGenreDto) {
    const genre = await this.findOne(id); // throws 404 if it does not exist

    // nothing to change
    if (!dto.name) {
      return genre;
    }

    const slug = this.makeSlug(dto.name);
    await this.checkFree(dto.name, slug, id);
    return this.prisma.genre.update({
      where: { id },
      data: { name: dto.name, slug },
    });
  }

  // delete a genre (not allowed while it still has books)
  async remove(id: number) {
    await this.findOne(id); // throws 404 if it does not exist

    const bookCount = await this.prisma.book.count({ where: { genreId: id } });
    if (bookCount > 0) {
      throw new ConflictException('Cannot delete a genre that still has books');
    }
    return this.prisma.genre.delete({ where: { id } });
  }

  // "Science Fiction" becomes "science-fiction"
  private makeSlug(name: string) {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (!slug) {
      throw new BadRequestException('Genre name must have letters or numbers');
    }
    return slug;
  }

  // helper: no other genre may use this name or slug (409 if one does)
  private async checkFree(name: string, slug: string, ignoreId?: number) {
    const where: Prisma.GenreWhereInput = { OR: [{ name }, { slug }] };
    if (ignoreId !== undefined) {
      where.NOT = { id: ignoreId };
    }
    const existing = await this.prisma.genre.findFirst({ where });
    if (existing) {
      throw new ConflictException('A genre with this name already exists');
    }
  }
}