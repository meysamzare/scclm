import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreThemplateEditComponent } from './score-themplate-edit.component';

describe('ScoreThemplateEditComponent', () => {
  let component: ScoreThemplateEditComponent;
  let fixture: ComponentFixture<ScoreThemplateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreThemplateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreThemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
