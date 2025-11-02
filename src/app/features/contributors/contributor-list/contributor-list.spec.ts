import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorList } from './contributor-list';

describe('ContributorList', () => {
  let component: ContributorList;
  let fixture: ComponentFixture<ContributorList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributorList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContributorList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
