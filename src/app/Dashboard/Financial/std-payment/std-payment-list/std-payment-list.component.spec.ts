import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StdPaymentListComponent } from './std-payment-list.component';

describe('StdPaymentListComponent', () => {
  let component: StdPaymentListComponent;
  let fixture: ComponentFixture<StdPaymentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StdPaymentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StdPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
