import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { ViewProfileState } from '../../states';
import { Observable } from 'rxjs';
import { DataService } from '../../services';
import { share, map, switchMap, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  colorOptions = ['red', 'blue', 'yellow', 'black', 'white', 'green'];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.loadData();
    this.initForm();
    this.loadForm();
  }

  private loadData() {
    this.definitions$ = this.dataService.getDefinitions().pipe(
      share()
    );

    this.templates$ = this.fcode$.pipe(
      switchMap(fcode =>
        this.dataService.getVehicleTemplate().pipe(
          map((templates: any[]) =>
            templates.filter(template => template.fleet_code === fcode))
        )),
      share()
    );
  }

  private loadForm() {
    const formData$ = this.templates$.pipe(
      map(templates => templates && templates.length > 0 ?
        this.buildFormData(templates) : null)
    );
    formData$.subscribe(data => data ?
      this.rootForm.setValue(data) : this.initForm());
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
  private initForm() {
    this.rootForm = this.fb.group({
      sets: this.fb.array([
       this.fb.group({
          type: 'guage',
          entries: this.fb.array([
            this.fb.group({
              spn: null,
              description: null,
              max: null,
              min: null,
              color: null,
              enabled: false
            }),
            this.fb.group({
              spn: null,
              description: null,
              max: null,
              min: null,
              color: null,
              enabled: true
            })
          ])
        }),
        this.fb.group({
          type: 'bar',
          entries: this.fb.array([
            this.fb.group({
              spn: null,
              description: null,
              max: null,
              min: null,
              color: null,
              enabled: true
            }),
            this.fb.group({
              spn: null,
              description: null,
              max: null,
              min: null,
              color: null,
              enabled: false
            })
          ])
        }),
        this.fb.group({
          type: 'switch',
          entries: this.fb.array([
            this.fb.group({
              spn: null,
              description: null,
              max: null,
              min: null,
              color: null,
              enabled: true
            }),
            this.fb.group({
              spn: null,
              description: null,
              max: null,
              min: null,
              color: null,
              enabled: false
            })
          ])
        }),
      ])
    });

  }


  save() {
    console.log(this.rootForm.value);
  }

  private buildFormData(data: any[]): any {
    const groups = this.groupBy(data, 'type');
    const sets = Object.keys(groups).map(key => {
      return {
        type: key,
        entries: this.filterFields(groups[key])
      };
    });
    const output = {
      sets: sets
    };
    return output;
  }

  private groupBy(list: any[], key: string) {
    return list.reduce((acc: any[], cur: any) => {
      acc[cur[key]] = acc[cur[key]] || [];
      acc[cur[key]].push(cur);
      return acc;
    }, {});
  }

  private filterFields(entries: any[]) {
    return entries.map(entry => {
      return {
        spn: entry.spn,
        description: entry.description,
        max: entry.max,
        min: entry.min,
        color: entry.color,
        enabled: entry.enabled
      };
    });
  }
}

/* example data
  private updateForms() {
    this.rootForm.setValue({
      sets: [
        {
          type: "guage",
          entries: [
            {
              spn: "xxxx",
              description: "left guage",
              color: "white",
              enabled: false
            },
            {
              spn: "yyyy",
              description: "right guage",
              color: "red",
              enabled: true
            }
          ]
        },
        {
          type: "bar",
          entries: [
            {
              spn: "zzzz",
              description: "left bar",
              color: "blue",
              enabled: true
            },
            {
              spn: "2222",
              description: "right bar",
              color: "yellow",
              enabled: false
            }
          ]
        },
        {
          type: "switch",
          entries: [
            {
              spn: "zzzz",
              description: "left bar",
              color: "blue",
              enabled: true
            },
            {
              spn: "2222",
              description: "right bar",
              color: "yellow",
              enabled: false
            }
          ]
        }
      ]
    });

  }
*/
