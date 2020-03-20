import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStdPasswordComponent } from './change-std-password.component';

describe('ChangeStdPasswordComponent', () => {
  let component: ChangeStdPasswordComponent;
  let fixture: ComponentFixture<ChangeStdPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeStdPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeStdPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
