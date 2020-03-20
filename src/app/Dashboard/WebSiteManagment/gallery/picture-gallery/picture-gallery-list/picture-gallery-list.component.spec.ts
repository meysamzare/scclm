import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureGalleryListComponent } from './picture-gallery-list.component';

describe('PictureGalleryListComponent', () => {
  let component: PictureGalleryListComponent;
  let fixture: ComponentFixture<PictureGalleryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureGalleryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureGalleryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
