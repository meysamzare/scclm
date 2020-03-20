import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StdPaymentEditComponent } from './std-payment-edit.component';

describe('StdPaymentEditComponent', () => {
  let component: StdPaymentEditComponent;
  let fixture: ComponentFixture<StdPaymentEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StdPaymentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StdPaymentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
