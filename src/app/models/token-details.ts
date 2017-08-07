export class TokenDetails {

  constructor(private _username: string, private _expiryTime: number, private _permanentBuyerFlag: string) {
  }

  get username() {
    return this._username;
  }

  get permanentBuyerFlag() {
    return this._permanentBuyerFlag;
  }

  get expiryTime() {
    return this._expiryTime;
  }

  isTokenExpired(): boolean {
    if (isNaN(this.expiryTime)) {
      return false;
    }
    const now = new Date();
    return (now.getTime() > this.expiryTime);
  }

}
