# postReceive
Test Scripts and EML file(s). 

## General Instructions:


### message1.eml : A test EML file with attachments and more.
#### Source: https://www.phpclasses.org/browse/file/14672.html
```
 Use: cat /opt/postReceive/test_scripts/message1.eml | /opt/postReceive/server/processor.js
 Returns: The HTML response code and its response text via axios.
```

### email-via-telnet.sh : Sends a short email using the information in the script.
```
 Use: /opt/postReceive/test_scripts/email-via-telnet.sh
 Returns: Nothing. Use 'tail -f /var/log/mail.log' to view postfix log.
```
