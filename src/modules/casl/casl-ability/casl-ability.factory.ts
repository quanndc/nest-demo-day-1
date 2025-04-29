import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Category } from "src/domains/category/entities/category.entity";
import { Product } from "src/domains/product/entities/product.entity";
import { User } from "src/domains/user/entities/user.entity";
import { Action } from "src/enums/action.enum";
import { Role } from "src/enums/role.enum";

type Subjects = InferSubjects<typeof Product | typeof User | typeof Category> | 'all';

export type AppAbility = Ability<[string, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[string, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.roles.includes(Role.ADMIN)) {
      can(Action.Manage, 'all'); // read-write access to everything
    } else if (user.roles.includes(Role.USER)) {
      can(Action.Read, User, { id: user.id });
      can(Action.Read, Product);
    }

    cannot(Action.Delete, Product, { isActive: true });
    
    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
