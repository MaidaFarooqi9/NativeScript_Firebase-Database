import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError ,tap} from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import {User} from './user.model';

const FIREBASE_API_KEY = 'AIzaSyATF_8gCXQ5VuUuMkRJRo7JI4_ySFFiexM';//settings->webAPI





interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
  }

@Injectable({ providedIn: 'root' })
export class AuthService {

    private _user=new BehaviorSubject<User>(null);
  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    return this.http //add return so that you can subscribe in comp.ts file
      .post<AuthResponseData>(
       ` https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
        { email: email, password: password, returnSecureToken: true }
      ).pipe(catchError(errRes=>{
          this.handleError(errRes.error.error.message);
           return throwError(errRes);
    }),tap(resData => {
        if (resData && resData.idToken) {

            this.handleLogin(
                email,
                resData.idToken,
                resData.localId,
                parseInt(resData.expiresIn)
              );
        }

    })  );
      /*.subscribe(resData => {
        console.log(resData);
      }); remove this bec we weill subscribe after successful llogin and signup in comp.ts */
  }
   get user(){
       return this._user.asObservable();
   }



  login(email: string, password: string) {
   return this.http
    .post<AuthResponseData>(
       `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      { email: email, password: password, returnSecureToken: true }
    ).pipe(catchError(errRes=>{

        this.handleError(errRes.error.error.message);
          return throwError(errRes);}),tap(resData => {
            if (resData && resData.idToken) {

                this.handleLogin(
                    email,
                    resData.idToken,
                    resData.localId,
                    parseInt(resData.expiresIn)
                  );

             // paste in handleLogin const expirydate= new Date(new Date().getTime()+parseInt(resData.expiresIn)*(1000));
            //const user=new User(email,resData.localId,resData.idToken,expirydate);
            //this._user.next(user);//const user wala user
            }

        }
          ))
   /* .subscribe(resData => {
      console.log(resData);
    });*/
  }




  private handleLogin(
    email: string,
    token: string,
    userId: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this._user.next(user);
  }

private handleError (errorMessage:string){


switch(errorMessage){
    case 'EMAIL-EXISTS':
        alert('email already exists');
        break;
    case 'INVALID-PASSWORD':
        alert('Password is incorrect');
        default:
            alert('enter correct information');
}

}

}
