import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
class SkipTake {
  public skip: number;
  public take: number;
  public order: number;
  public name: string
}
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    
    return this.userService.create(createUserDto);
  }

  @Post('/pagination')
  findAll(@Body() skipTake: SkipTake) {
    return this.userService.findAll(skipTake.skip , skipTake.take, skipTake.order, skipTake.name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
