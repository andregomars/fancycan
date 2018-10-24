import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { ViewProfileState } from '../../states';
import { Observable } from 'rxjs';
import { DataService } from '../../services';
import { share } from 'rxjs/operators';
import { FormBuilder, Form, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-vehicle-template',
  templateUrl: './vehicle-template.component.html',
  styleUrls: ['./vehicle-template.component.scss']
})
export class VehicleTemplateComponent implements OnInit {
  @Select(ViewProfileState.fcode) fcode$: Observable<string>;
  definitions$: Observable<any[]>;
  templates$: Observable<any[]>;
  rootForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.loadData();
    this.initForms();
  }

  private loadData() {
    this.definitions$ = this.dataService.getDefinitions().pipe(
      share()
    );

    this.templates$ = this.dataService.getVehicleTemplate().pipe(
      share()
    );
  }

  /*
  == DOM ==
  form group (form)
  - form array  (tables)
    - form group  (table)
      - form array (tbody.trs)
        - form group  (tr)
          - form control (td)
          - form control (td)
          - ...
    - form group  (table)
      - form array (tbody.trs)
        - form group  (tr)
          - form control (td)
          - form control (td)
          - ...

  == Model ==
  template
  - sets
    - set[type='guage']
      - entries
        - entry
          - entry.spn
          - entry.description
          - ...
    - set[type='bar']
      - entries
        - entry
          - entry.spn
          - entry.description
          - ...
  */
  private initForms() {
    this.rootForm = this.fb.group({
      sets: this.fb.array([
       this.fb.group({
            type: 'guage',
            entries: this.fb.array([
              this.fb.group({
                spn: '1111',
                description: 'left guage'
              }),
              this.fb.group({
                spn: '2222',
                description: 'right guage'
              })
            ])
        }),
        this.fb.group({
          type: 'bar',
          entries: this.fb.array([
            this.fb.group({
              spn: '1111',
              description: 'left bar'
            }),
            this.fb.group({
              spn: '2222',
              description: 'right bar'
            })
          ])
        }),
      ])
    });

  }

  debug(obj: FormGroup) {
    console.log(obj);
    console.log((obj.get('type')));
    // console.log(obj);
  }
}
