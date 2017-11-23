import { Directive, ElementRef, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Gesture } from 'ionic-angular/gestures/gesture';
declare var Hammer;

@Directive({
  selector: '[longPress]'
})

export class LongPressDirective implements OnInit, OnDestroy {
  el: HTMLElement;
  pressGesture: Gesture;
  @Output('longPress') onPress: EventEmitter<any> = new EventEmitter();

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    const pressOptions = {
      recognizers: [
        [Hammer.Press, { time: 2800 }]
      ]
    }

    this.pressGesture = new Gesture(this.el, pressOptions);
    this.pressGesture.listen();

    this.pressGesture.on('press', e => {
      this.onPress.emit(e);
    })
  }

  ngOnDestroy() {
    this.pressGesture.destroy();
  }
}