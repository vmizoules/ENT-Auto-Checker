#!/usr/bin/env python
#-*- coding: utf-8 -*-

import smtplib
import sys

from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText

# message
lines = sys.stdin.readlines()
message = ""
for i in range(len(lines)):
    message += lines[i]

# email setting
msg = MIMEMultipart()
msg['From'] = 'sender@email.com'
msg['To'] = 'your@email.com'
msg['Subject'] = '[ISIMA][ENT] Nouvelle note dispo !' 

msg.attach(MIMEText(message))

mailserver = smtplib.SMTP('mail.gmx.com', 587)
mailserver.ehlo()
mailserver.starttls()
mailserver.ehlo()
mailserver.login('sender_login', 'sender_password')
mailserver.sendmail('sender@email.com', 'your@email.com', msg.as_string())
mailserver.quit()

