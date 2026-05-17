import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Realizardonacion } from './realizardonacion';

describe('Realizardonacion', () => {
  let component: Realizardonacion;
  let fixture: ComponentFixture<Realizardonacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Realizardonacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Realizardonacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
