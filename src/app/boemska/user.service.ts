import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { User } from './user.interface';

@Injectable()
export class UserService {
  public user: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor() { }
}
