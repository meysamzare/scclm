import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTypeListComponent } from './student-type-list.component';

describe('StudentTypeListComponent', () => {
  let component: StudentTypeListComponent;
  let fixture: ComponentFixture<StudentTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
