import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginItemComponent } from './login-item.component';

describe('LoginItemComponent', () => {
  let component: LoginItemComponent;
  let fixture: ComponentFixture<LoginItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
