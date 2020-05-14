import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParagraphCardComponent } from './paragraph-card.component';
import { MaterialModule } from 'src/app/material/material.module';
import { Paragraph } from '../../model/paragraph';
import { By } from '@angular/platform-browser';

describe('ParagraphCardComponent', () => {
  let component: ParagraphCardComponent;
  let fixture: ComponentFixture<ParagraphCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule ],
      declarations: [ ParagraphCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParagraphCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('input paragrph data should display correctly', () => {
    // Arrange
    const paragraphData: Paragraph = {
      id: 10,
      content: '<p>Content</p>'
    };

    // Act
    component.paragraph = paragraphData;
    fixture.detectChanges();

    // Assert
    const renderedId = fixture.debugElement.query(By.css('h3'));
    let element: HTMLElement = renderedId.nativeElement;
    expect(element.innerText).toContain(paragraphData.id.toString());
    const renderedContent = fixture.debugElement.query(By.css('.paragraph-card-content'));
    element = renderedContent.nativeElement;
    expect(element.innerHTML).toContain(paragraphData.content);
  });

  it('empty paragrph data should result in a loading progress spinner', () => {
    // Arrange
    const paragraphData: Paragraph = undefined;

    // Act
    component.paragraph = paragraphData;
    fixture.detectChanges();

    // Assert
    const renderedId = fixture.debugElement.query(By.css('h3'));
    expect(renderedId).toBeFalsy();
    const renderedContent = fixture.debugElement.query(By.css('.paragraph-card'));
    const element = renderedContent.nativeElement;
    expect(element.innerHTML).toContain('Loading paragraph ...');
  });
});
