import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from 'src/database/entity.repository';
import { Document, DocumentDocument } from './entities/document.entity';

@Injectable()
export class DocumentsRepository extends EntityRepository<DocumentDocument> {
  constructor(
    @InjectModel(Document.name) public documentModel: Model<DocumentDocument>,
  ) {
    super(documentModel);
  }
}
