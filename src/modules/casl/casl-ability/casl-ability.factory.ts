import { PureAbility, AbilityBuilder, AbilityClass, InferSubjects } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { User } from "src/domains/user/entities/user.entity";
import { DataSource } from "typeorm";

import * as ROLE_UTILS from 'src/utils/role/role.utils';
import { Product } from "src/domains/product/entities/product.entity";

type Subjects = InferSubjects<typeof Product > | 'all';

export type AppAbility = PureAbility<[string, Subjects | string]>;

const sqlToCaslMap: Record<string, 'read' | 'create' | 'update' | 'delete'> = {
  SELECT: 'read',
  INSERT: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
};

@Injectable()
export class CaslAbilityFactory {
  constructor(@InjectDataSource('default') private dataSource: DataSource) { }
  async createForUser(user: User, table: string[]) {

    const privs = await ROLE_UTILS.getPrivilegesByTableOptimized('admin_user', table, this.dataSource)

    const { can, cannot, build } = new AbilityBuilder<
      PureAbility<[string, Subjects | string]>
    >(PureAbility as AbilityClass<AppAbility>);

    for (const table in privs) {
      const entity = table; //tableToEntityMap[table];
      const perms = privs[table];

      perms.forEach(sql => {
        const casl = sqlToCaslMap[sql];
        if (casl) {
          can(casl, entity ?? table);
        }
      });
    }

    return build({
      detectSubjectType: (item: any) => 
        item ?.constructor || item.type || item,
    } as any);
  }
}