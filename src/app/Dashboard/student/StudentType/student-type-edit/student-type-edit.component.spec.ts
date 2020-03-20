import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTypeEditComponent } from './student-type-edit.component';

describe('StudentTypeEditComponent', () => {
  let component: StudentTypeEditComponent;
  let fixture: ComponentFixture<StudentTypeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentTypeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentTypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
