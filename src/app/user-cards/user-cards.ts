import { Component, signal, effect, computed, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-cards',
  templateUrl: './user-cards.html',
  styleUrls: ['./user-cards.scss'],
})
export class UserCards implements OnInit {
  title: string = 'User Cards';

  price = signal(100);
  qty = signal(2);

  total = computed(() => this.price() * this.qty());

  ngOnInit() {
    // effect(() => console.log(`Total: ${this.total()}`));
  }

  addQty() {
    this.qty.update((q) => q + 1);
  }
}
