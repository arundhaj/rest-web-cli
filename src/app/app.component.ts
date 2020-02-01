import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  selectedHttpMethod = 'GET';
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
    this.loading = true;
    this.spinner.show();
    this.http.request(this.selectedHttpMethod, this.inputUrl, { observe: 'response' }).subscribe((successResponse) => {
      this.response = successResponse;
      this.responseBody = JSON.stringify(successResponse.body, null, 2);
    }, (error) => {
      this.errorMessage = error.message;
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

    if (this.requestParams.length === 0) {
      this.requestParams.push({...this.requestParamsEmpty});
    }
  }

  requestHeaderChanged(idx) {
    if (idx === this.requestHeaders.length - 1) {
      this.requestHeaders.push({...this.requestHeadersEmpty});
    }
  }

  deleteRequestHeader(idx) {
    this.requestHeaders.splice(idx, 1);

    if (this.requestHeaders.length === 0) {
      this.requestHeaders.push({...this.requestHeadersEmpty});
    }
  }
}
