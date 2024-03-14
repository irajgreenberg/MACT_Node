PImage ira;
color[][] cols;
color[] cols1D;

int freq, cell;
float[] extrudes;

void setup() {
  size(600, 600, P3D);
  ira = loadImage("ira_photo_matte.png");
  ira.resize(600, 600);
  freq = 30;
  cell = ira.width/freq;
  cols = new color[ira.width/cell][ira.height/cell];

  extrudes = new float[cols.length];
  //cols1D = new color[(ira.width/cell) * (ira.height/cell)];
  noStroke();
  for (int i=0, k=0; i<ira.width; i+=cell) {
    for (int j=0; j<ira.height; j+=cell) {
      extrudes[k] = random(10, 100);
      k = i*ira.height+j;
    }
  }

  ira.loadPixels();
}

void draw() {
  background(255);
  lights();
  for (int i=0, k=0; i<ira.width; i+=cell) {
    for (int j=0; j<ira.height; j+=cell) {

       k = i*ira.height+j;
      color c = ira.get(i, j);
      if (brightness(c)<10) {
      } else {
        // cols1D[k] = c;
        //println(k);
        // cols[i][j] = c;
        fill(c);
        //println
        // rect(i, j, cell, cell);
        pushMatrix();
        translate(i, j, 0);
        box(cell, cell, extrudes[k]);
        popMatrix();
      }
    }
  }
}
