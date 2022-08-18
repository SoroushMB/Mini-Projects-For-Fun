import pywhatkit 

PH_NUM = input("Enter the phone number: ")
MSG = input("Enter the massage: ")
HR = int(input("Enter hour: "))
MIN = int(input("Enter minutes: "))

pywhatkit.sendwhatmsg(PH_NUM, MSG, HR, MIN)