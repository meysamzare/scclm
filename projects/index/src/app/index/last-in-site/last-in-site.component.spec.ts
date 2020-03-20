import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastInSiteComponent } from './last-in-site.component';

describe('LastInSiteComponent', () => {
  let component: LastInSiteComponent;
  let fixture: ComponentFixture<LastInSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastInSiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastInSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
