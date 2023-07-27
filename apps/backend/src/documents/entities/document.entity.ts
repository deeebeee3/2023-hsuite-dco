import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DocumentDocument = HydratedDocument<Document>;

export enum DocumentCategories {
  ID_CARD = 'ID_CARD',
  PERSONAL_ID_CARD = 'PERSONAL_ID_CARD',
  BUSINESS_ID_CARD = 'BUSINESS_ID_CARD',
  PROPERTY_CARD = 'PROPERTY_CARD',
}

export enum Status {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
@Schema()
export class Document {
  // @Transform(({ value }) => value.toString())
  // _id: ObjectId;

  @Prop()
  userId: string;

  @Prop()
  hash: string;

  @Prop({ default: Status.PENDING })
  status: string;

  @Prop({ default: DocumentCategories.ID_CARD })
  category: string;

  // @Prop({ type: Types.ObjectId, ref: User.name })
  // @Type(() => User)
  // user: User;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
