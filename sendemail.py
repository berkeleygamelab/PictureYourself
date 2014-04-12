import smtplib, sys
#from smtplib import SMTP_SSL as SMTP       # this invokes the secure SMTP protocol (port 465, uses SSL)
from smtplib import SMTP                  # use this for standard SMTP protocol   (port 25, no encryption)

from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
from email.MIMEImage import MIMEImage

COMMASPACE = ', '
USERNAME = "picyourfuture"
PASSWORD = "Py12ab21yP"
SERVER = "smtp.gmail.com"
SUBJECT = "PIC YOUR FUTURE"
TEXT = 'PIC Your Future at Berkeley\nwww.py-bcnm.berkeley.edu\n;)'
SEND_FROM = 'picyourfuture@gmail.com'

try:
    send_to = sys.argv[1] #person@domain.com,person@domain.com
    filepath = sys.argv[2]
except:
    print "Failed"
      
# print send_to.replace(',', ', ')  
# print filepath

try:  
    msg = MIMEMultipart()
    msg['Subject'] = SUBJECT
    msg['From'] = SEND_FROM
    msg['To'] = send_to.replace(',', ', ')    

    part1 = (MIMEText(TEXT, 'plain'))
    fp = open(filepath, 'rb')
    part2 = MIMEImage(fp.read(), _subtype= "jpeg")
    fp.close()
    part2.add_header('Content-Disposition', 'attachment', filename='selfieAt.png')
    msg.attach(part1)
    msg.attach(part2)

    conn = smtplib.SMTP(SERVER)
    conn.set_debuglevel(False)#To avoid verbosing...
    conn.ehlo()
    conn.starttls()
    conn.ehlo()
    conn.login(USERNAME, PASSWORD)

    try:
        conn.sendmail(SEND_FROM, send_to, msg.as_string())
    finally:
        conn.close()

except Exception, exc:
    sys.exit( "mail failed; %s" % str(exc) ) # give a error message
