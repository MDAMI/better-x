import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DEFAULT_PERMISSIONS, Permission } from './permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async getDefault(): Promise<Permission> {
    const permission: Permission = await this.permissionsRepository.findOne({
      where: {
        viewPermissions: null,
        editPermissions: null,
        inheritEditPermissions: true,
        inheritViewPermissions: true,
      },
    });
    if (permission) {
      return permission;
    } else {
      return this.permissionsRepository.save(DEFAULT_PERMISSIONS);
    }
  }
}
