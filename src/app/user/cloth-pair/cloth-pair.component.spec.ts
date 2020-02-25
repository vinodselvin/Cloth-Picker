import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClothPairComponent } from './cloth-pair.component';

describe('ClothPairComponent', () => {
  let component: ClothPairComponent;
  let fixture: ComponentFixture<ClothPairComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClothPairComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClothPairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
