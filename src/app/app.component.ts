import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as ace from 'ace-builds';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'ng-api-cli';
  inputUrl = 'https://jsonplaceholder.typicode.com/todos';

  response: any;
  responseBody: any;

  requestParamsEmpty = {Key: '', Value: ''};
  requestParams = [{...this.requestParamsEmpty}];
  requestHeadersEmpty = {Key: '', Value: ''};
  requestHeaders = [{...this.requestHeadersEmpty}];

  requestBody: any;

  requestHttpMethod = 'GET';
  httpMethods = ['GET', 'POST', 'PUT', 'DELETE'];

  errorMessage = '';

  loading = false;

  @ViewChild('requestEditor', {static: false}) requestEditor;
  @ViewChild('responseEditor', {static: false}) responseEditor;

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.requestEditor.setTheme('eclipse');
    this.requestEditor.getEditor().setOptions({
      mode: 'ace/mode/json'
    });

    this.responseEditor.setTheme('eclipse');
    this.responseEditor.getEditor().setOptions({
      readOnly: true,
      mode: 'ace/mode/json'
    });
  }

  sendRequest() {
    this.clearPrevState();

    const queryParamList = [];
    let queryUrl = this.inputUrl;

    this.requestParams.forEach(param => {
      if (param.Key && param.Value) {
        queryParamList.push(param.Key + '=' + param.Value);
      }
    });

    if (queryParamList.length > 0) {
      queryUrl += '?' + queryParamList.join('&');
    }

    let headers = new HttpHeaders();
    this.requestHeaders.forEach(header => {
      if (header.Key && header.Value) {
        headers = headers.set(header.Key, header.Value);
      }
    });

    this.loading = true;
    this.spinner.show();
    this.http.request(this.requestHttpMethod, queryUrl,
        { 
          headers: headers,
          body: this.requestBody,
          observe: 'response'
        }).subscribe((successResponse) => {
      this.response = successResponse;
      this.responseBody = JSON.stringify(successResponse.body, null, 2);
    }, (errorResponse) => {
      this.response = errorResponse;
      this.errorMessage = errorResponse.message;
      this.responseBody = JSON.stringify(errorResponse.error, null, 2);
    }).add(() => {
      this.loading = false;
      this.spinner.hide();
    });
  }

  clearPrevState() {
    this.errorMessage = '';
    this.responseBody = '';
  }

  requestParamChanged(idx) {
    if (idx === this.requestParams.length - 1) {
      this.requestParams.push({...this.requestParamsEmpty});
    }
  }

  deleteRequestParam(idx) {
    this.requestParams.splice(idx, 1);
  }

  requestHeaderChanged(idx) {
    if (idx === this.requestHeaders.length - 1) {
      this.requestHeaders.push({...this.requestHeadersEmpty});
    }
  }

  deleteRequestHeader(idx) {
    this.requestHeaders.splice(idx, 1);
  }
}
