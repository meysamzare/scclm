import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreThemplateListComponent } from './score-themplate-list.component';

describe('ScoreThemplateListComponent', () => {
  let component: ScoreThemplateListComponent;
  let fixture: ComponentFixture<ScoreThemplateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreThemplateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreThemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
