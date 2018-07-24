interface AlertInterface {
  type: string,
  message: string,
  err?: object,
  closed: boolean
}

export class Alert implements AlertInterface {
  public type: string;
  public message: string;
  public err: object;
  public closed: boolean;

  constructor(type: string, message: string, err?: object) {
    this.type = type;
    this.message = message;
    this.err = err;
    this.closed = false;
  }
}
