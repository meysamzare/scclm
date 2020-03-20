import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentScoreEditComponent } from './student-score-edit.component';

describe('StudentScoreEditComponent', () => {
  let component: StudentScoreEditComponent;
  let fixture: ComponentFixture<StudentScoreEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentScoreEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentScoreEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
