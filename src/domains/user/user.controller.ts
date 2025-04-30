import { Controller, Get, Post, Param, ParseIntPipe, UseGuards, UploadedFile, UseInterceptors, BadRequestException, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { ActionGuard } from 'src/guards/action/action.guard';
import { Actions } from 'src/decorators/actions.decorator';
import { Action } from 'src/enums/action.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypeResult, fromBuffer } from 'file-type';


@Controller('user')
export class UserController {

  constructor(private userSevice: UserService) { }

  //accessToken
  //refreshToken -> optional
  // @Throttle({default: { limit: 2, ttl: 60000 }})

  // @Get('refreshToken')
  // refreshToken(@Req() req: Request){
  //   return this.userSevice.refreshToken(req);
  // }

  @Get()
  @UseGuards(AuthGuard)
  @UseGuards(ActionGuard)
  @Roles([Role.ADMIN, Role.USER])
  @Actions({
    action: Action.Read,
    subject: 'all',
  })
  findAll() {
    return this.userSevice.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @UseGuards(ActionGuard)
  @Roles([Role.USER])
  @Actions({
    action: Action.Read,
    subject: 'all',
  })
  // @Roles([Role.ADMIN])
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userSevice.findOne(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    // Validate file type using file-type
    const fileType: FileTypeResult | undefined = await fromBuffer(file.buffer);

    if (!fileType) {
      throw new BadRequestException('Unable to determine file type');
    }

    // Example: Allow only PNG and JPEG files
    const allowedMimeTypes = ['image/png', 'image/jpeg'];
    if (!allowedMimeTypes.includes(fileType.mime)) {
      throw new BadRequestException(`Invalid file type: ${fileType.mime}`);
    }

    console.log('File is valid:', fileType);
    return { message: 'File uploaded successfully', fileType };
  }
}
