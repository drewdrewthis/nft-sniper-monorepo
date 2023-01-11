import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiKeyAuthGuard } from '../auth/apikey-auth.guard';

@Controller('user')
@UseGuards(ApiKeyAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.userService.findOne(uuid);
  }

  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+uuid, updateUserDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.userService.remove(+uuid);
  }

  /**
   * Regisering a user can happen with a discordId and/or a walletAddress
   * @param createUserDto
   * @returns
   */
  @Post('register')
  regiser(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.discordId && !createUserDto.walletAddress) {
      throw new BadRequestException(
        'Must provide either a discordId or a walletAddress',
      );
    }

    return this.userService.register(createUserDto);
  }
}
