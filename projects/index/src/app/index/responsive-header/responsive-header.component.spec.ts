import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveHeaderComponent } from './responsive-header.component';

describe('ResponsiveHeaderComponent', () => {
  let component: ResponsiveHeaderComponent;
  let fixture: ComponentFixture<ResponsiveHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsiveHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
