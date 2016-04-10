//Adafruit Microphone Amplifier

const int SAMPLE_WINDOW = 35; // Sample window width in mS
const int LOUDNESS_THRESHOLD = 6;
const int STREAK_THRESHOLD = 2500;
const int TAPS_IN_A_ROW = 5;
const int MAX_T_BETWEEN_TAPS = 1500;
const int TAPS_WIN = true;
int numTaps;
int lastTapTime;
int streakStart;
int sample;

void setup() {
    Serial.begin(9600);
    numTaps = 0;
    lastTapTime = 0;
    streakStart = -1;
    // TODO for microphone device, select between taps and sound streaks by setting TAPS_WIN
}

bool isHighValue(double value) {
   return value > LOUDNESS_THRESHOLD;
}

bool hadLongLapse(unsigned int lastTap) {
    return millis() - lastTap > MAX_T_BETWEEN_TAPS;
}

double getSignalStrength(int max, int min) {
   return ((max - min) * 3.3) / 1024 * 100; // max - min = peak-peak amplitude, convert to volts * 100
}

void loop() {
   long startMillis= millis();  // Start of sample window
   int peakToPeak = 0;   // peak-to-peak level
   int maxSignal = 0;
   int minSignal = 1024;
   // collect data for sampleWindow mS
   while ((millis() - startMillis) < SAMPLE_WINDOW) {
      sample = analogRead(0);
      if (sample < 1024) { // toss out spurious readings
         if (sample > maxSignal) {
            maxSignal = sample;  // save just the max levels
         } else if (sample < minSignal) {
            minSignal = sample;  // save just the min levels
         }
      }
   }

   double value = getSignalStrength(maxSignal, minSignal);

   if(isHighValue(value))
   {
      // We've found a high value!
       numTaps++;
       lastTapTime = millis();
       Serial.println("Noise!");

       //We may have a streak:
       if(!TAPS_WIN && (streakStart == -1)) {
           streakStart = lastTapTime;
            Serial.println("Streak start");
       } else if (!TAPS_WIN && ((lastTapTime - streakStart) >= STREAK_THRESHOLD)) {
            Serial.println("WINNNNNN SOUND STREAK!"); // TODO replace with server call
            streakStart  = -1;
       }
   }
   else if((numTaps > 0) && (hadLongLapse(lastTapTime)))
   {
       if(TAPS_WIN)
       {
           if(numTaps == TAPS_IN_A_ROW)
           {
               Serial.println("WINNNNNN SOUND TAPS"); // TODO replace with server call
           }
           else
           {
               Serial.println("Lost");
           }
       }
       else
       {
           streakStart = -1;
       }
       numTaps = 0;
   }
}
