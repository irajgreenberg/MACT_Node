PImage ira;
//color[][] cols;
//color[] cols1D;

int freqW,freqH, cellW, cellH;
float[] extrudes;

void setup() {
  size(600, 600, P3D);

  noStroke();

  ira = loadImage("ira_photo_matte.png");
  ira.resize(600, 600);

  freqW = 20;
  freqH = 20;
  cellW = ira.width/freqW;
  cellH = ira.height/freqH;
  //cols1D = new color[freq*freq];
  extrudes = new float[freqW*freqH];

  for (int i=0, k=0; i<freqW; i++) {
    for (int j=0; j<freqH; j++) {
       k = i*freqH+j;
       extrudes[k] = random(2, 8);
    }
  }
  ira.loadPixels();
}

void draw() {
  background(0);
  lights();
  for (int i=0, k=0; i<freqW; i++) {
    for (int j=0; j<freqH; j++) {
      k = i*freqH+j;
      color c = ira.get(i*cellW, j*cellH);
      if (brightness(c)<10) {
      } else {
        fill(c);
        pushMatrix();
        translate(i*cellW, j*cellH, extrudes[k]);
        scale(1, 1, extrudes[k]);
        box(cellW, cellH, 5);
        popMatrix();
      }
    }
  }
}
