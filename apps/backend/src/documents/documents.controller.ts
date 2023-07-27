import {
  Bind,
  Body,
  Controller,
  Post,
  Request,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  HttpException,
  Patch,
  Query,
  Get,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
/* import fetch from 'node-fetch'; */
import {
  AnyFilesInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express/multer';
import { Readable } from 'stream';
import { createHash } from 'crypto';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { generatePdf } from 'src/utils/helpers';
import { User } from 'src/users/entities/user.entity';
import { MailerService } from 'src/mailer/mailer.service';

import { Status } from './entities/document.entity';
import { AdminGuard } from 'src/guards/admin.guard';
import { FileValidationPipe } from 'src/pipes/file-validation.pipe';
import { htmlUploadTemplate } from 'src/templates/html.upload.template';
import { htmlIdCardTemplate } from 'src/templates/html.idcard.template';
import { ConfigService } from '@nestjs/config';

@Controller('documents')
@ApiTags('documents')
export class DocumentsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly documentsService: DocumentsService,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiBadGatewayResponse()
  @ApiBadRequestResponse()
  @ApiOperation({ summary: `Find all documents. You must be an Admin user.` })
  @Get()
  async findAllDocsForAdmin() {
    try {
      const documents = await this.documentsService.findAllDocuments();

      return documents;
    } catch (error) {
      throw new HttpException(error.message, 400, {
        cause: error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiBadGatewayResponse()
  @ApiBadRequestResponse()
  @ApiOperation({ summary: `Find a document by userId` })
  @Get('by-userid')
  async findDocsForUser(@Query('userid') userId: string) {
    const user = await this.documentsService.getDocumentByUserId({ userId });

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiBadGatewayResponse()
  @ApiBadRequestResponse()
  @ApiOperation({ summary: `Accepts the users form along with an attachment` })
  @Post('upload')
  @UseInterceptors(AnyFilesInterceptor(), FileValidationPipe)
  async create(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @Body() createDocumentDto: CreateDocumentDto,
    @Request() req,
  ) {
    try {
      const attachments = [];
      const { user }: { user: Partial<User> } = req;

      const { userId }: User = await this.usersService.getUserBy({
        email: user.email,
      });

      if (!files || files.length < 3) {
        const hasFileIDCard = files.find((f) => f.fieldname === 'fileIDCard');
        const hasFilePassportPhoto = files.find(
          (f) => f.fieldname === 'filePassportPhoto',
        );

        if (!hasFileIDCard || !hasFilePassportPhoto) {
          throw new BadRequestException(
            'Please upload a passport photo and an ID card file',
          );
        }
      }

      files.forEach((file) => {
        const stream = Readable.from(file.buffer);
        attachments.push({
          filename: file.originalname,
          content: stream,
        });
      });

      const html = htmlUploadTemplate({
        ...createDocumentDto,
        emailAddress: user.email,
      });
      const pdfBytes = await generatePdf(html);
      if (pdfBytes) {
        const stream = new Readable();
        stream.push(pdfBytes);
        stream.push(null);

        attachments.push({
          filename: 'Document.pdf',
          content: stream,
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { notes, ...rest } = createDocumentDto;
      const hash = createHash('md5').update(JSON.stringify(rest)).digest('hex');

      await this.mailerService.sendMail(
        `${
          this.configService.get<Record<string, string>>('mailer').dcoAdminEmail
        }`,
        'Documents attached and hash in messsage',
        'upload-document',
        {
          hash,
        },
        attachments,
      );

      return this.documentsService.create(userId, hash);
    } catch (error) {
      throw new HttpException(error.message, 400, {
        cause: error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiBadGatewayResponse()
  @ApiBadRequestResponse()
  @ApiOperation({
    summary: `Sets the document status. It must be sent by an admin`,
  })
  @Patch('set-status')
  @UseInterceptors(FileInterceptor('file'))
  @Bind(UploadedFile())
  async update(
    file,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @Request() req,
  ) {
    try {
      const attachments = [];
      const {
        user: { email: adminEmail },
      }: { user: Partial<User> } = req;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { notes, status, hash, certifiedHash, ...rest } = updateDocumentDto;

      const docFromHash = await this.documentsService.findOne(hash);

      if (status === Status.APPROVED) {
        const hashFromForm = createHash('md5')
          .update(JSON.stringify(rest))
          .digest('hex');

        const isFormValid = await this.documentsService.findOne(hashFromForm);

        if (isFormValid) {
          await this.documentsService.updateDocument(updateDocumentDto);
        } else {
          throw new BadRequestException('form is invalid');
        }

        const { userId } = isFormValid;
        const { email: userEmail }: User = await this.usersService.getUserBy({
          userId,
        });

        if (!certifiedHash) {
          throw new BadRequestException('certified hash was not provided');
        }

        /* the original hash was valid so create an anon version of the PDF
        - but what should this obfuscated data be?  */
        const html = htmlIdCardTemplate({
          obfuscatedData: hash,
          certifiedHash,
        });
        const pdfBytes = await generatePdf(html);
        if (pdfBytes) {
          const stream = new Readable();
          stream.push(pdfBytes);
          stream.push(null);

          attachments.push({
            filename: 'IDCard.pdf',
            content: stream,
          });
        }

        /* simulate successful upload it to IPFS */
        // const response = await fetch('https://the-ipfs-url-here-from-env-var', {
        //   method: 'POST',
        //   headers: {
        //     'Content-length': pdfBytes.length.toString(),
        //   },
        //   body: pdfBytes,
        // });

        /* check if it was successful here */
        // const data = await response.json();

        /* if status was 200 then send another email both to admin/user with the pdf */
        if (true) {
          await this.mailerService.sendMail(
            `${adminEmail}, ${userEmail}`,
            'ID Card attached',
            'upload-document',
            {
              hash,
              certifiedHash,
            },
            attachments,
          );
        }
      }

      if (status === Status.REJECTED || status === Status.PENDING) {
        await this.documentsService.updateDocument(updateDocumentDto);
      }

      const { email: applicantEmail } = await this.usersService.getUserBy({
        userId: docFromHash.userId,
      });

      await this.mailerService.sendMail(
        applicantEmail,
        `Your Application Status`,
        'status-update',
        {
          applicantEmail,
          status,
        },
      );

      return `Status set to ${status}`;
    } catch (error) {
      throw new HttpException(error.message, 400, {
        cause: error.message,
      });
    }
  }
}
