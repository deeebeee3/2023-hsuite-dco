import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentsRepository } from './documents.repository';
import { Document, DocumentDocument } from './entities/document.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name) private documentsModel: Model<DocumentDocument>,
    private readonly documentsRepository: DocumentsRepository,
  ) {}

  async getDocumentByUserId(param: Record<string, any>): Promise<Document> {
    const doc = await this.documentsRepository.findOne(param);

    if (!doc) {
      throw new NotFoundException('document not found');
    }

    return doc;
  }

  async create(userId: string, hash: string) {
    return this.documentsRepository.create({
      hash,
      userId,
    });
  }

  findOne(hash: string) {
    return this.documentsRepository.findOne({ hash });
  }

  async updateDocument(
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    const { hash, status } = updateDocumentDto;
    return this.documentsRepository.findOneAndUpdate({ hash }, { status });
  }

  async findAllDocuments() {
    return this.documentsRepository.find({});
  }
}
