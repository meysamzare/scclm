import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginMessagesComponent } from './login-messages.component';

describe('LoginMessagesComponent', () => {
  let component: LoginMessagesComponent;
  let fixture: ComponentFixture<LoginMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
