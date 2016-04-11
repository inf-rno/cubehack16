//OSEPP TCS3200 Color sensor

int s0=D0,s1=D1,s2=D2,s3=D3;
int flag=0;
byte counter=0;
byte countR=0,countG=0,countB=0;
void setup()
 {
 Serial.begin(115200);
 pinMode(s0,OUTPUT);
 pinMode(s1,OUTPUT); 
 pinMode(s2,OUTPUT);
 pinMode(s3,OUTPUT);
 }
void TCS()
 {
 flag=0;  
 digitalWrite(s1,HIGH);
 digitalWrite(s0,HIGH);
 digitalWrite(s2,LOW);
 digitalWrite(s3,LOW);
 attachInterrupt(A0, ISR_INTO, FALLING);
 timer0_init();

 }
void ISR_INTO()
 {
 counter++;
 }
 void timer0_init(void)
 {
  TCCR2A=0x00;
  TCCR2B=0x07;   //the clock frequency source 1024 points
  TCNT2= 100;    //10 ms overflow again
  TIMSK2 = 0x01; //allow interrupt
 }
  ISR(TIMER2_OVF_vect)//the timer 2, 10ms interrupt overflow again. Internal overflow interrupt executive function
{
    TCNT2=100;
    flag++;
    //detect color values from calibrated sensors below.
 if(flag==1)
  {
    countR=counter;
    Serial.print("red=");
    Serial.println(countR,DEC);
    digitalWrite(s2,HIGH);
    digitalWrite(s3,HIGH);
  }
  else if(flag==2)
   {
    countG=counter;
    Serial.print("green=");
    Serial.println(countG,DEC);
    digitalWrite(s2,LOW);
    digitalWrite(s3,HIGH);
   }
   else if(flag==3)
    {
    countB=counter;
    Serial.print("blue=");
    Serial.println(countB,DEC);
    Serial.println("\n"); 
    digitalWrite(s2,LOW);
    digitalWrite(s3,LOW);
   
    }
    else if(flag==4)
     {
     flag=0;
     }
       counter=0;
}
void loop()
 {
  TCS();
while(1);
 }
