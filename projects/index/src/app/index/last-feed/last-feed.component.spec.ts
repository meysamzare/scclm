import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastFeedComponent } from './last-feed.component';

describe('LastFeedComponent', () => {
  let component: LastFeedComponent;
  let fixture: ComponentFixture<LastFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
