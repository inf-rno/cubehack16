#include "pitches.h"


int buzzer = D0; 

int photoresistor = A5;
int lightValue;
int lightBuzzDelay=0;
int lightWin = 0;

char GAME_STATE = '1'; //idle, awake, running, won, lost
unsigned long roundTimer = 0;
int ROUND_TIME_LIMIT = 5000; // 60 sec


TCPClient client;

void setup() {
    pinMode(buzzer,OUTPUT);
    Serial.begin(9600);
    Serial.println("lawlaw");
    roundTimer = millis();
    
    if (client.connect("google.com", 80))
    {
        Serial.println("connected");
    }
    else
    {
        Serial.println("connection failed");
    }
}

void loop() {

    lightValue = analogRead(photoresistor);
    handleLight(lightValue);
    delay(100);
    
  if (client.available())
  {
    byte b = client.read();
    if (GAME_STATE < '0' && GAME_STATE > '9') {
        GAME_STATE = b;
    }
  }
}

void handleLight(int v) {
    if (GAME_STATE != '1')
     return;
     
    v = map(v, 50, 1200, 0, 100);

    lightBuzzDelay++;
    if (lightBuzzDelay >= v) {
        lightBuzzDelay = 0;
        beep();
    }
    
    if (v<=0) {
        lightWin++;
    } else {
        lightWin = 0;
    }
    
    if (lightWin > 5) {
        gameWin();
    }
    
    //Serial.println(t);
    if (millis() - roundTimer > ROUND_TIME_LIMIT) {
        gameLoss();
    }
}

void beep() {
    tone(buzzer,400,50);
}

void gameWin() {
    GAME_STATE = 'w';
    beepWin();
    Serial.println("WIIIIIIIIIIIIIIIIIN");
    client.println("{\"win\":true}");
}

void gameLoss() {
    GAME_STATE = 'l';
    beepLoss();
    Serial.println("LOOOOOOOOOOOOOOOOOOOOSE");
    client.println("{\"win\":false}");
}

void beepWin() {

// notes in the melody:
int melody[] = {
  NOTE_C4, NOTE_G3, NOTE_G3, NOTE_A3, NOTE_G3, 0, NOTE_B3, NOTE_C4
};

// note durations: 4 = quarter note, 8 = eighth note, etc.:
int noteDurations[] = {
  4, 8, 8, 4, 4, 4, 4, 4
};
  // iterate over the notes of the melody:
  for (int thisNote = 0; thisNote < 8; thisNote++) {

    // to calculate the note duration, take one second
    // divided by the note type.
    //e.g. quarter note = 1000 / 4, eighth note = 1000/8, etc.
    int noteDuration = 1000 / noteDurations[thisNote];
    tone(buzzer, melody[thisNote], noteDuration);

    // to distinguish the notes, set a minimum time between them.
    // the note's duration + 30% seems to work well:
    int pauseBetweenNotes = noteDuration * 1.30;
    delay(pauseBetweenNotes);
    // stop the tone playing:
    noTone(buzzer);
  }
}

void beepLoss() {
    
// notes in the melody:
int melody[] = {
  NOTE_C4, NOTE_B3, NOTE_A3, NOTE_G3, NOTE_F3
};

// note durations: 4 = quarter note, 8 = eighth note, etc.:
int noteDurations[] = {
  4, 4, 4, 4, 1
};

  // iterate over the notes of the melody:
  for (int thisNote = 0; thisNote < 8; thisNote++) {

    // to calculate the note duration, take one second
    // divided by the note type.
    //e.g. quarter note = 1000 / 4, eighth note = 1000/8, etc.
    int noteDuration = 1000 / noteDurations[thisNote];
    tone(buzzer, melody[thisNote], noteDuration);

    // to distinguish the notes, set a minimum time between them.
    // the note's duration + 30% seems to work well:
    int pauseBetweenNotes = noteDuration * 1.30;
    delay(pauseBetweenNotes);
    // stop the tone playing:
    noTone(buzzer);
  }
}