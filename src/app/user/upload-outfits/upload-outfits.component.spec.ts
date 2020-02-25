import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadOutfitsComponent } from './upload-outfits.component';

describe('UploadOutfitsComponent', () => {
  let component: UploadOutfitsComponent;
  let fixture: ComponentFixture<UploadOutfitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadOutfitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadOutfitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
