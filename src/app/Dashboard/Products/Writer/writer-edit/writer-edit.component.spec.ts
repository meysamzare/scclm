import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriterEditComponent } from './writer-edit.component';

describe('WriterEditComponent', () => {
  let component: WriterEditComponent;
  let fixture: ComponentFixture<WriterEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriterEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
