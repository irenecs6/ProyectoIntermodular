import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Detalleayuda } from './detalleayuda';

describe('Detalleayuda', () => {
  let component: Detalleayuda;
  let fixture: ComponentFixture<Detalleayuda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detalleayuda]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Detalleayuda);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
