import { Component, OnInit } from '@angular/core';
import { NeuralStyleService } from './neuralstyle.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  templateUrl: './neuralstyle.component.html',
  styleUrls: ['./neuralstyle.component.css']
})
export class NeuralStyleComponent implements OnInit {
  pageTitle = 'Neural Style Transfer';
  imageWidth = 50;
  imageMargin = 2;
  showImage = false;
  errorMessage = '';
  styleImgURL: string | ArrayBuffer;
  contentImgURL: string | ArrayBuffer;
  outputImgURL: SafeUrl;
  selectedStyleFile: ImageSnippet;
  selectedContentFile: ImageSnippet;
  
  constructor(private NeuralStyleService: NeuralStyleService,
                    private domSanitizer: DomSanitizer) {}

  onStyleFileChanged(event) {
    this.selectedStyleFile = new ImageSnippet('image',event.target.files[0]);
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedStyleFile.file);
    reader.onload = event => {
      this.styleImgURL = reader.result;
    }
  }
  
  onContentFileChanged(event) {
    this.selectedContentFile = new ImageSnippet('image',event.target.files[0]);
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedContentFile.file);
    reader.onload = event => {
      this.contentImgURL = reader.result;
    }
  }

  onUploadStyle() {
    this.NeuralStyleService.uploadStyleImage(this.selectedStyleFile.file).subscribe(
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
      })
  }

  onUploadContent() {
    this.NeuralStyleService.uploadContentImage(this.selectedContentFile.file).subscribe(
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
      })
  }

  onDownloadContent() {
    this.NeuralStyleService.
    downloadResultImage().
    subscribe((val) => {
      this.createImageFromBlob(val);
    });
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.outputImgURL = this.domSanitizer.bypassSecurityTrustUrl(<string>reader.result);
    }, false);
  if (image) {
      reader.readAsDataURL(image);
    }
  }


  ngOnInit(): void {   
    this.NeuralStyleService.loadNeuralModel().subscribe(
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
      }); 
  }
}