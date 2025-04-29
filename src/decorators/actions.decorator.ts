import { SetMetadata } from '@nestjs/common';
import { Action } from 'src/enums/action.enum';

export const Actions = (...actions: { action: string; subject: string }[]) =>
  SetMetadata(Action, actions);