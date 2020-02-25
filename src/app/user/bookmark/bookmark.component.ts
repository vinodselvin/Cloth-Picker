import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import * as html2Canvas from 'html2canvas';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss']
})
export class BookmarkComponent implements OnInit {

  private user: any;
  public images: any;
  public bookmarks = null;

  constructor(private firestore: AngularFirestore, private filestorage: AngularFireStorage, private route: ActivatedRoute) { 
    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.user = data;
        this.getBookmark();
      }
    });

    
  }
  ngOnInit() {
  }

  getBookmark(){
    
    var firestore = this.firestore;
    var user = this.user;

    var images$ = firestore.collection<any>('images', ref =>
      ref.where('uid', '==', user.uid)).valueChanges();

    images$.subscribe(data => this.processBookmark(data));
  }

  processBookmark(data: any){

    var firestore = this.firestore;
    var user = this.user;
    var self = this;
    var new_data = {};

    if(data){
      for(var key in data){
        var e_data = data[key];

        if(new_data && new_data[e_data.outfit_type]){
          new_data[e_data.outfit_type][e_data.id] = e_data;
        }
        else{
          new_data[e_data.outfit_type] = [];
          new_data[e_data.outfit_type][e_data.id] = e_data;
        }
      }

      this.images = new_data;
      
      var pairs$ = firestore.collection<any>('pairs', ref => ref.where('uid', '==', user.uid).where('like', '==', '1')).valueChanges();

      pairs$.subscribe(pdata => {

        if(pdata && pdata.length > 0){
          self.bookmarks = pdata;
        }
        else{
          self.bookmarks = [];
        }
      });
    }
    else{
      self.bookmarks = [];
    }

    
  }

  shareFiles(id: any){

    // var convertMeToImg = document.getElementById(id);
    
    // html2Canvas(convertMeToImg).then(function(canvas) {
      
    //   document.getElementById(id).append(canvas);
        
    // });
    
    let newVariable: any;

    newVariable = window.navigator;

    var img = document.querySelectorAll("#"+id+" img");
    
    var files = [];

    img.forEach(e_img => {
      files.push((<HTMLImageElement>e_img).src);
    });

    console.log(files);
    if (newVariable && newVariable.share) {
      newVariable.share({
        title: 'Todays Combination',
        text: 'I used Cloth picker app and got perfect outfit match for today. See the Below link for Shirt/T-Shirt: '+files[0]+"\n and  Pant: "+ files[1],
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      alert('share not supported, try with mobile.');
    }
      
  }

}
