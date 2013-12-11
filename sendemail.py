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
TEXT = 'PIC Your Future at Berkeley'
SEND_FROM = 'picyourfuture@gmail.com'

send_tos = sys.argv[1]
send_to = send_tos.split(',')
filepath = sys.argv[2]

print send_to
print filepath
COMMASPACE = ', '

try:  
    msg = MIMEMultipart()
    msg['Subject'] = SUBJECT
    msg['From'] = SEND_FROM
    msg['To'] = COMMASPACE.join(send_to)

    part1 = (MIMEText(TEXT, 'plain'))
    fp = open(filepath, 'rb')
    part2 = MIMEImage(fp.read(), _subtype= "jpeg")
    fp.close()
    msg.attach(part1)
    msg.attach(part2)

    conn = smtplib.SMTP(SERVER)
    conn.set_debuglevel(True)
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
