import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OpenFoodFactsResponse } from './models';

@Injectable({
  providedIn: 'root',
})
export class OpenFoodFactsService {
  private readonly http = inject(HttpClient);
  getProduct(barcode: string) {
    return this.http.get<OpenFoodFactsResponse>(
      `https://world.openfoodfacts.org/api/v3/product/${barcode}`,
      { params: { fields: 'product_name,brands,image_front_url,code,categories,nutriscore_grade' } },
    );
  }
}
