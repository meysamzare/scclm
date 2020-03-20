import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentScoreListComponent } from './student-score-list.component';

describe('StudentScoreListComponent', () => {
  let component: StudentScoreListComponent;
  let fixture: ComponentFixture<StudentScoreListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentScoreListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentScoreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
