HOST='localhost'
PORT='25'
FROM='MAIL FROM: <root>'
TO='RCPT TO: <root>'
CMD='DATA'
SUBJECT='Subject: test'
MESSAGE='This is a test message.'
END='.'

(
echo open ${HOST} ${PORT}
sleep 1
echo "$FROM"
sleep 1
echo "$TO"
sleep 1
echo "$CMD"
sleep 1
echo "$SUBJECT"
sleep 1
echo "$MESSAGE"
sleep 1
echo "$END"
sleep 1
echo "quit") | telnet
