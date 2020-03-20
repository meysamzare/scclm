import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisingEditComponent } from './advertising-edit.component';

describe('AdvertisingEditComponent', () => {
  let component: AdvertisingEditComponent;
  let fixture: ComponentFixture<AdvertisingEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvertisingEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertisingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
