import { HttpErrorResponse } from '@angular/common/http';
import { UpperCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';

import { MyPantryProduct, OpenFoodFactsProduct } from '../models';
import { OpenFoodFactsService } from '../openFoodFacts.service';

@Component({
  selector: 'app-add-product',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    UpperCasePipe,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent {
  private readonly foodService = inject(OpenFoodFactsService);

  readonly product = signal<OpenFoodFactsProduct | undefined>(undefined);
  readonly errorMessage = signal<string | undefined>(undefined);
  readonly searching = signal(false);

  readonly quantity = signal<number | undefined>(undefined);
  readonly unit = signal<MyPantryProduct['unit']>('piece');
  readonly expirationDate = signal('');
  readonly minThreshold = signal<number | undefined>(undefined);
  readonly storagePlace = signal<MyPantryProduct['storagePlace']>('closet');

  searchProduct(barcode: string): void {
    const trimmedBarcode = barcode.trim();

    if (!trimmedBarcode) {
      this.errorMessage.set('Veuillez saisir un code-barres.');
      return;
    }

    this.product.set(undefined);
    this.errorMessage.set(undefined);
    this.searching.set(true);

    this.foodService
      .getProduct(trimmedBarcode)
      .pipe(finalize(() => this.searching.set(false)))
      .subscribe({
        next: ({ product }) => {
          this.product.set(product);
        },
        error: (error: HttpErrorResponse) => {
          this.handleSearchError(error);
        },
      });
  }

  addProduct(): void {
    const product = this.product();

    if (!product) {
      return;
    }

    const quantity = this.quantity();
    const minThreshold = this.minThreshold();
    const expirationDate = this.expirationDate();

    if (
      quantity === undefined ||
      quantity <= 0 ||
      minThreshold === undefined ||
      minThreshold < 0 ||
      !expirationDate
    ) {
      return;
    }

    const myPantryProduct: MyPantryProduct = {
      product,
      quantity,
      unit: this.unit(),
      expirationDate: new Date(expirationDate),
      minThreshold,
      storagePlace: this.storagePlace(),
    };

    console.log('Produit à ajouter au stock :', myPantryProduct);
  }

  private handleSearchError(error: HttpErrorResponse): void {
    if (error.status === 404) {
      this.errorMessage.set('Produit introuvable.');
      return;
    }

    if (error.status === 0) {
      this.errorMessage.set('Erreur réseau. Vérifiez votre connexion.');
      return;
    }

    this.errorMessage.set('Impossible de récupérer le produit.');
  }
}
