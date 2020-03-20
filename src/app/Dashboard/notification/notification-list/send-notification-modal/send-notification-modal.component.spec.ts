import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendNotificationModalComponent } from './send-notification-modal.component';

describe('SendNotificationModalComponent', () => {
  let component: SendNotificationModalComponent;
  let fixture: ComponentFixture<SendNotificationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendNotificationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendNotificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
