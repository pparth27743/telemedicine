import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { baseUrl, webrtcServerUrl } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { WebrtcService } from './webrtc.service';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get getcurrentUser() {
    this.currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value;
  }

  validate(): Observable<any> {
    return this.http.get(`${baseUrl}users/validate`);
  }

  login(data): Observable<any> {
    return this.http.post(`${baseUrl}users/login/`, data)
      .pipe(map(results => {
        if (results['success']) {
          localStorage.setItem('currentUser', JSON.stringify(results['currentUser']))
        };
        return results;
      }));
  }

  signup(data): Observable<any> {
    return this.http.post(`${baseUrl}users/signup`, data);
  }

  // Error Functions
  handleError(error, from = undefined) {
    console.error(`An Error Occurred from : ${from} :: `, error);
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

}
