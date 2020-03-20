import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketConversationsComponent } from './ticket-conversations.component';

describe('TicketConversationsComponent', () => {
  let component: TicketConversationsComponent;
  let fixture: ComponentFixture<TicketConversationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketConversationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketConversationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
