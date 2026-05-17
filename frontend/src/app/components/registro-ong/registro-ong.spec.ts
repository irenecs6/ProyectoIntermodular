import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroOng } from './registro-ong';

describe('RegistroOng', () => {
  let component: RegistroOng;
  let fixture: ComponentFixture<RegistroOng>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroOng]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroOng);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
