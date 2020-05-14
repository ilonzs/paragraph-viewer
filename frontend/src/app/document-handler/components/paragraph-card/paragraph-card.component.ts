import { Component, OnInit, Input } from '@angular/core';
import { Paragraph } from '../../model/paragraph';

@Component({
  selector: 'paragraph-card',
  templateUrl: './paragraph-card.component.html',
  styleUrls: ['./paragraph-card.component.scss']
})
export class ParagraphCardComponent {

  /**
   * Paragraph input data
   */
  @Input()
  paragraph: Paragraph;

  constructor() { }

}
