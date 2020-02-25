import { Component, OnInit } from '@angular/core';
import { ImagesService } from 'src/app/images.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-cloth-pair',
  templateUrl: './cloth-pair.component.html',
  styleUrls: ['./cloth-pair.component.scss']
})
export class ClothPairComponent implements OnInit {

  private user: any;
  public best_combo: any;
  public images: any;

  constructor(private firestore: AngularFirestore, private filestorage: AngularFireStorage, private route: ActivatedRoute) { 
    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.user = data;
        this.getBestCombo();
      }
    });

    
  }

  ngOnInit() {
    
  }

  getBestCombo(){
    var firestore = this.firestore;
    var user = this.user;

    var images$ = firestore.collection<any>('images', ref =>
      ref.where('uid', '==', user.uid)).valueChanges();

    images$.subscribe(data => this.processCombo(data));
    
  }

  processCombo(data: any){
    var firestore = this.firestore;
    var user = this.user;
    var self = this;

    if(data && data.length > 0){

      var combos = this.getCombos(data);
      console.log("all combos");
      console.log(combos);
      var best_combo = [];

      var pairs$ = firestore.collection<any>('pairs', ref =>
      ref.where('uid', '==', user.uid)).valueChanges();

      pairs$.subscribe(pdata => {
        console.log(pdata);
        
        if(pdata.length > 0 && combos){
        
          best_combo = this.diffOfTwoObject(combos, pdata);

          if(best_combo && best_combo.length > 0){
            best_combo = best_combo[0];
          }
          else{
            best_combo = null;
          }
        }
        else{
          best_combo = combos[0];
        }
        
        if(best_combo == null || !best_combo){
          self.best_combo = null;
        }
        else{
          self.best_combo = {
            '1': self.images['1'][best_combo['1']],
            '2': self.images['2'][best_combo['2']]
          }
        }

      });
      
    }
  }

  diffOfTwoObject(result1: any, result2: any){

    return result1.filter(o1 => !result2.some(o2 => o1['1'] === o2['1'] && o1['2'] === o2['2']));
  }


  getCombos(data: any){

    var new_data = {};
    var combos = [];

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

    if(new_data && new_data['1'] && new_data['2']){
      
      for(var key in new_data['1']){
        var a1 = new_data['1'][key];
        for(var key2 in new_data['2']){
          var a2 = new_data['2'][key2];
          combos.push({'1': a1.id, '2': a2.id});
        }
      }
    }
    
    return combos;
  }

  likeImage(){
    var best_combo = this.best_combo;

    var data = {
      '1': best_combo['1'].id,
      '2': best_combo['2'].id,
      'uid': best_combo['1'].uid,
      'like': '1'
    }

    this.saveActionAndContinue(data);
  }
  
  disLikeImage(){
    var best_combo = this.best_combo;
    
    var data = {
      '1': best_combo['1'].id,
      '2': best_combo['2'].id,
      'uid': best_combo['1'].uid,
      'like': '2'
    }

    this.saveActionAndContinue(data);

  }

  saveActionAndContinue(data: any){
    var self = this;
    console.log(data);
    this.firestore.collection('pairs').add(data).then(function(e){
      self.getBestCombo();
    });
  }
}
