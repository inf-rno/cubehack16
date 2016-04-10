int patternLED = D0;
int winLED = D2;
int lostLED = D3;
int touchSensor = D1;
int lastInputState;
int touchPatternIndex = 0;
int patternLength = 14;
long tolerance = 500;
unsigned long pattern[] = { 400, 100, 200, 100, 200, 100, 400, 100, 400, 500, 400, 100, 400, 100 };
unsigned long nextToggleTime = 0;
int nextOutputToggle = HIGH;
int mode = 0;

void setup()
{
    pinMode(patternLED, OUTPUT);
    pinMode(touchSensor, INPUT);
    pinMode(winLED, OUTPUT);
    pinMode(lostLED, OUTPUT);
    lastInputState = digitalRead(touchSensor);
    Serial.begin(9600);
}

void idle()
{
    digitalWrite(patternLED, LOW);
    digitalWrite(winLED, LOW);
    digitalWrite(lostLED, LOW);
    if(lastInputState != digitalRead(touchSensor))
    {
        lastInputState = digitalRead(touchSensor);
        touchPatternIndex = 0;
        nextToggleTime = 0;
        nextOutputToggle = HIGH;
        mode = 1;
        //Serial.println("Switch to mode 1");
    }
}

void playPattern()
{
    digitalWrite(winLED, LOW);
    unsigned long tm = millis();
    if(tm >= nextToggleTime)
    {
        nextToggleTime = tm + pattern[touchPatternIndex++];
        digitalWrite(patternLED, nextOutputToggle);
        nextOutputToggle = (nextOutputToggle == LOW) ? HIGH : LOW;
    }
    if(touchPatternIndex == 14)
    {
        touchPatternIndex = 0;
        nextToggleTime = 0;
        mode = 2;
        lastInputState = digitalRead(touchSensor);
        //Serial.println("Switch to mode 2");
    }
}

void readPattern()
{
    long tm = millis();
    if(lastInputState != digitalRead(touchSensor))
    {
        lastInputState = digitalRead(touchSensor);
        if(touchPatternIndex > 0)
        {
            long delta = tm - nextToggleTime;
            if ((delta >= (-tolerance)) && (delta <= tolerance))
            {
                touchPatternIndex += 2;
                if(touchPatternIndex == 14)
                {
                    lastInputState = digitalRead(touchSensor);
                    mode = 4;
                }
                else
                {
                    nextToggleTime = tm + (pattern[touchPatternIndex] + pattern[touchPatternIndex + 1]);
                }
            }
            else
            {
                // Game over
                char msg [50];
                sprintf(msg, "miss = %d", delta);
                Serial.println(msg);
                lastInputState = digitalRead(touchSensor);
                mode = 3;
            }
        }
        else
        {
            nextToggleTime = tm + (pattern[touchPatternIndex] + pattern[touchPatternIndex + 1]);
            touchPatternIndex += 2;
        }
    }
    else if((touchPatternIndex > 0) && (tm >= (nextToggleTime + tolerance)))
    {
        // Game over
        lastInputState = digitalRead(touchSensor);
        mode = 3;
    }
}


void lost()
{
    digitalWrite(patternLED, LOW);
    digitalWrite(winLED, LOW);
    digitalWrite(lostLED, HIGH);
    if(lastInputState != digitalRead(touchSensor))
    {
        mode = 0;
    }
}

void win()
{
    digitalWrite(patternLED, LOW);
    digitalWrite(winLED, HIGH);
    digitalWrite(lostLED, LOW);
    if(lastInputState != digitalRead(touchSensor))
    {
        mode = 0;
    }
}

void loop()
{
    switch(mode)
    {
        case 0:
            idle();
            break;
        case 1:
            playPattern();
            break;
        case 2:
            readPattern();
            break;
        case 3:
            lost();
            break;
        case 4:
            win();
            break;
    }
}
