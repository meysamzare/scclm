import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureGalleryEditComponent } from './picture-gallery-edit.component';

describe('PictureGalleryEditComponent', () => {
  let component: PictureGalleryEditComponent;
  let fixture: ComponentFixture<PictureGalleryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureGalleryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureGalleryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
