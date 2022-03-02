import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}


  async create(createUserDto: CreateUserDto) {
    await this.verifyUnique(createUserDto)
    try {
      return await this.usersRepository.save(this.usersRepository.create(createUserDto));
    }
    catch (err) { throw new HttpException({ msg: 'Já existe um perfil com essas informações.', error: err }, HttpStatus.CONFLICT) }
  }

  async findAll(skip: number, take: number, order: any, name?: string) {
    let list;
    if(name)
      list = await this.usersRepository.find({order: {name: order}, skip: skip, take: take, where: {name: Like(`%${name}%`)}});
    else    
      list = await this.usersRepository.find({order: {name: order}, skip: skip, take: take});
    const count = await this.usersRepository.count()
    return {list, count};
  }

  async findOne(id: number) {
    let user
    try { user = await this.usersRepository.findOne(id); }
    catch (err) { throw new HttpException({ msg: 'Usuário não encontrado', error: err }, HttpStatus.NOT_FOUND); }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user: User = await this.usersRepository.findOne({where: {id} });
    if ((updateUserDto.email || updateUserDto.cpf) && updateUserDto.email != user.email && updateUserDto.cpf != user.cpf) await this.verifyUnique(updateUserDto)
    
    if (user) {
      // if (data.senha) {
      //   data.senha = await bcrypt.hash(data.senha, 12)
      // }
      // updateUserDto.updated = new Date()
      try { return await this.usersRepository.save({...user, ...updateUserDto }); }
      catch (err) { throw new HttpException({ msg: 'Houve um erro ao concluir a atualização.', error: err }, HttpStatus.INTERNAL_SERVER_ERROR) }
    } else throw new HttpException({ msg: 'Usuario não encontrado', error: null }, HttpStatus.NOT_FOUND);
  }

  async delete(id: string) {
    try { return await this.usersRepository.softDelete(id); }
    catch (err) { throw new HttpException({ msg: 'Houve um erro ao deletar o usuário.', error: err }, HttpStatus.INTERNAL_SERVER_ERROR) }
  }
  //Uso promisse all caso tenha que verificar outras tabelas
  async verifyUnique(data) {
    var [user] = await Promise.all([
      this.usersRepository.find({ where: [{ email: data.email || '' }, { cpf: data.cpf || '' }]}),
    ])
    if (user.length) throw new HttpException({ msg: 'Já existe um perfil com essas informações.', error: null }, HttpStatus.CONFLICT)
  }
}
