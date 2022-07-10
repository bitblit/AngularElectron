import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test1',
  templateUrl: './test1.component.html',
})
export class Test1Component {
  constructor(public router: Router) {}
}
