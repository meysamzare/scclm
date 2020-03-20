import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherChangePasswordModalComponent } from './teacher-change-password-modal.component';

describe('TeacherChangePasswordModalComponent', () => {
  let component: TeacherChangePasswordModalComponent;
  let fixture: ComponentFixture<TeacherChangePasswordModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherChangePasswordModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherChangePasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
