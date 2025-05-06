import { Subject } from '@casl/ability';
import { SetMetadata } from '@nestjs/common';
import { Action } from 'src/enums/action.enum';

export const Actions = (...actions: { action: string; subject: string | Subject }[]) =>
  SetMetadata(Action, actions);