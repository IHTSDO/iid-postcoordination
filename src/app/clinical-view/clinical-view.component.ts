import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clinical-view',
  templateUrl: './clinical-view.component.html',
  styleUrls: ['./clinical-view.component.css']
})
export class ClinicalViewComponent implements OnInit {

  bones: any[] = [
    { code: "Humerus", display: "Humerus" },
    { code: "Radius", display: "Radius" },
    { code: "Ulna", display: "Ulna" },
    { code: "Carpal bones", display: "Carpal bones" },
    { code: "Metacarpal bones", display: "Metacarpal bones" },
    { code: "Phalanges", display: "Phalanges" }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}