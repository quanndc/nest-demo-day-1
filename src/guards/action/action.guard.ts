import { ForbiddenError } from '@casl/ability';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Action } from 'src/enums/action.enum';
import { ActionModel } from 'src/models/action.model';
import { CaslAbilityFactory } from 'src/modules/casl/casl-ability/casl-ability.factory';

@Injectable()
export class ActionGuard implements CanActivate {

  constructor(private caslAbilityFactory: CaslAbilityFactory,
    private reflector: Reflector
  ) {}

  async canActivate(
    context: ExecutionContext,
  ) {

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    console.log(`Action guarnd is running`);
    delete user.iat
    delete user.exp
    // console.log(user);

    const rules = this.reflector.get<ActionModel[]>(Action, context.getHandler());
    // console.log('rule get from decorator');
    // console.log(rules);
    const array = rules.map((rule) => {
      // Ensure the subject is converted to a string
      return rule.subject
    });

    const abilities = await this.caslAbilityFactory.createForUser(user, array);
    // console.log(abilities.rules);
    
    // console.log(array);

    try {
      if (Array.isArray(rules)) {
        for (const rule of rules) {
          ForbiddenError.from(abilities).throwUnlessCan(rule.action, rule.subject);
        }
      } else {
        ForbiddenError.from(abilities).throwUnlessCan(rules['action'], rules['subject']);
      }
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }
}
