import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private firestore: AngularFirestore) { 

  }

  getImages() {
    return this.firestore.collection('images').snapshotChanges();
  }

  insertImage(image: any){
    return this.firestore.collection('images').add(image);
  }

  updateImage(image: any){
    delete image.id;
    this.firestore.doc('images/' + image.id).update(image);
  }

  deletePolicy(id: string){
    this.firestore.doc('images/' + id).delete();
  }
}
