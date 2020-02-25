import { Component, OnInit, Input } from '@angular/core';
import { ImagesService } from 'src/app/images.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-upload-outfits',
  templateUrl: './upload-outfits.component.html',
  styleUrls: ['./upload-outfits.component.scss']
})
export class UploadOutfitsComponent implements OnInit {

  public imageSrc: any;
  public ref: any;
  public task: any;
  public uploadProgress: any;
  public downloadURL: any;
  public outfit_type: any;

  @Input() user;
  @Input() login_component;

  constructor(private firestore: AngularFirestore, private filestorage: AngularFireStorage, private route: ActivatedRoute,) {

  }

  ngOnInit() {
    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.user = data;
      }
    });
  }

  public fileChangeEvent(fileInput: any){

    var self = this;

    self.imageSrc = [];

    var all_files = fileInput.target.files;

    if (all_files) {

      for(var key in all_files){
        
        var e_file = all_files[key];

        var reader = new FileReader();

        reader.onload = function (e : any) {
          self.imageSrc.push(e.target['result']);
        }

        reader.readAsDataURL(e_file);
      }
    }
  } 

  public removeFile(file){
    
    var all_files = this.imageSrc;

    if(file && all_files){
      all_files.splice(file.key, 1);
    }
    
    this.imageSrc = all_files;


    console.log(this.imageSrc.length);
  }

  public saveFiles(){

    var all_files = this.imageSrc;
    var user = this.user;
    var firestore = this.firestore;
    var outfit_type = (<HTMLInputElement>document.getElementById("outfitType")).value;
    
    if(all_files && all_files.length > 0){

      for(var key in all_files){

        const randomId = Math.random().toString(36).substring(2);

        const storageRef = this.filestorage.storage.ref(`images/${randomId}.jpeg`);
        
        storageRef.putString(all_files[key], 'data_url')
          .then((snapshot) => {
            
            snapshot.ref.getDownloadURL().then(function(downloadURL){
              var image = {
                uid: user.uid, 
                image_data: downloadURL,
                outfit_type: outfit_type,
                id: randomId
              };
  
              firestore.collection('images').add(image);
            });

          })
          .catch((err) => {
            alert(`failed upload: ${err}`);
          });

      }

      this.imageSrc = [];

      alert("Successfully! Uploaded");
    }
    else{
      
    }
  }
}
